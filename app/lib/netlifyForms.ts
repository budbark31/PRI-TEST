// Netlify Forms: submissions show up under Forms in the Netlify dashboard and can be emailed to Penn Rock.
// The form definitions live in public/__forms.html.
export async function submitNetlifyForm(formName: string, fields: Record<string, string>) {
  const body = new URLSearchParams({ "form-name": formName, ...fields }).toString();
  const res = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);
}
