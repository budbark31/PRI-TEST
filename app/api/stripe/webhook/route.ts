import { NextResponse } from "next/server";
import { sanitizeText } from "@/app/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // Payments are paused during the consignment pivot. The original Stripe webhook
  // logic is preserved below for reactivation when needed.
  return NextResponse.json(
    { error: sanitizeText("Stripe webhooks are disabled during the consignment pivot.") },
    { status: 410 }
  );
}

/*
import Stripe from "stripe";
import { groq } from "next-sanity";
import { getAdminClient } from "@/sanity/lib/adminClient";
import { createLead, resolveStagesetId, setLeadStageset } from "@/app/lib/nutshell";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-06-20",
});

type LineItemInfo = {
  name: string | null;
  slug: string | null;
  quantity: number;
  unitAmount: number | null;
  totalAmount: number | null;
  imageUrl: string | null;
};

const PARTS_BY_SLUG_QUERY = groq`*[_type == "part" && slug.current in $slugs]{
  _id,
  "slug": slug.current,
  inventoryCount,
  status
}`;

const normalizeLineItems = (items: Stripe.ApiList<Stripe.LineItem>) =>
  items.data.map<LineItemInfo>((item) => {
    const product = item.price?.product as Stripe.Product | null;
    const metadata = product?.metadata || {};

    return {
      name: item.description || product?.name || null,
      slug: metadata.slug || null,
      quantity: item.quantity || 1,
      unitAmount: item.price?.unit_amount || null,
      totalAmount: item.amount_total || null,
      imageUrl: product?.images?.[0] || null,
    };
  });

const formatLeadDescription = (session: Stripe.Checkout.Session, lineItems: LineItemInfo[]) => {
  const lines = lineItems.map((item) => {
    const qty = item.quantity ?? 1;
    const name = item.name || "Item";
    return `- ${sanitizeText(name)} (qty: ${qty})`;
  });

  const amount = session.amount_total ? `$${(session.amount_total / 100).toFixed(2)}` : "Unknown";
  const email = sanitizeText(session.customer_details?.email || session.customer_email || "Unknown");
  const phone = sanitizeText(session.customer_details?.phone || "Unknown");

  return [
    `Stripe session: ${sanitizeText(session.id)}`,
    `Amount: ${sanitizeText(amount)}`,
    `Customer email: ${email}`,
    `Customer phone: ${phone}`,
    "Items:",
    ...lines,
  ].join("\n");
};

const createNutshellLeadForSession = async (
  session: Stripe.Checkout.Session,
  lineItems: LineItemInfo[]
) => {
  if (!process.env.NUTSHELL_API_KEY) {
    return;
  }

  const pipelineName = process.env.NUTSHELL_PIPELINE_NAME || "WebStore";
  const stageName = process.env.NUTSHELL_STAGE_NAME || "New Order";
  const stagesetId = await resolveStagesetId(pipelineName);

  if (!stagesetId) {
    console.warn("Nutshell pipeline not found:", pipelineName);
    return;
  }

  const customerName = sanitizeText(
    session.customer_details?.name || session.customer_email || "Web Store Order"
  );
  const lead = {
    name: `${customerName} - Web Store Order`,
    description: formatLeadDescription(session, lineItems),
    tags: ["webstore", "stripe"],
    value: session.amount_total
      ? { amount: session.amount_total / 100, currency: (session.currency || "usd").toUpperCase() }
      : undefined,
  };

  const created = await createLead(lead);
  const leadId = created?.id;

  if (!leadId) {
    console.warn("Nutshell lead creation did not return an id.");
    return;
  }

  await setLeadStageset(leadId, stagesetId);

  if (stageName.toLowerCase() !== "new order") {
    console.warn("Nutshell stage name configured but stageset was applied only.");
  }
};

const updatePartInventory = async (lineItems: LineItemInfo[]) => {
  const slugs = lineItems
    .map((item) => item.slug)
    .filter((slug): slug is string => Boolean(slug));

  if (!slugs.length) return;

  const adminClient = getAdminClient();
  const parts = await adminClient.fetch<{ _id: string; slug: string; inventoryCount: number | null; status: string | null; }[]>(
    PARTS_BY_SLUG_QUERY,
    { slugs }
  );
  const partsBySlug = new Map(parts.map((part) => [part.slug, part]));

  await Promise.all(
    lineItems.map(async (item) => {
      if (!item.slug) return;
      const part = partsBySlug.get(item.slug);
      if (!part || part.inventoryCount === null || part.inventoryCount === undefined) return;

      const nextCount = Math.max(0, part.inventoryCount - item.quantity);
      const nextStatus = nextCount === 0 ? "out-of-stock" : part.status || "available";

      await adminClient
        .patch(part._id)
        .set({ inventoryCount: nextCount, status: nextStatus })
        .commit({ autoGenerateArrayKeys: true });
    })
  );
};

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed.", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const adminClient = getAdminClient();
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ["data.price.product"],
      });
      const normalizedItems = normalizeLineItems(lineItems).map((item) => ({
        ...item,
        name: sanitizeText(item.name),
      }));
      const orderId = `order-${sanitizeText(session.id)}`;

      await adminClient.createIfNotExists({
        _id: orderId,
        _type: "order",
        stripeSessionId: sanitizeText(session.id),
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? sanitizeText(session.payment_intent)
            : sanitizeText(session.payment_intent?.id || ""),
        paymentStatus: sanitizeText(session.payment_status),
        amountTotal: session.amount_total,
        currency: sanitizeText(session.currency),
        customerEmail: sanitizeText(session.customer_details?.email || session.customer_email || ""),
        customerName: sanitizeText(session.customer_details?.name || ""),
        customerPhone: sanitizeText(session.customer_details?.phone || ""),
        source: sanitizeText(session.metadata?.source || ""),
        createdAt: new Date().toISOString(),
        lineItems: normalizedItems,
      });

      await updatePartInventory(normalizedItems);

      try {
        await createNutshellLeadForSession(session, normalizedItems);
      } catch (error) {
        console.error("Failed to create Nutshell lead.", error);
      }
    } catch (error) {
      console.error("Failed to record Stripe order.", error);
      return NextResponse.json({ error: "Failed to record order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
*/
