import CartPageClient from "@/app/components/CartPageClient";
import ContactButtons from "@/app/components/ContactButtons";

export const metadata = {
  title: "Contact Us | Penn Rock Industries",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-16 md:pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Online purchasing is not active. Call, text, or email us and we will handle the order directly.
        </p>
        <CartPageClient />
        <div className="mt-8 max-w-md">
          <ContactButtons truckTitle="general inquiries" />
        </div>
      </div>
    </main>
  );
}
