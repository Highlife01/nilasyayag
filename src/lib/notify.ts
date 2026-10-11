import type { Inquiry } from "@/lib/model"

export async function notifyInquiry(inquiry: Inquiry): Promise<Inquiry["notification"]> {
  const to = process.env.NOTIFY_EMAIL || "cebrailkara@gmail.com"
  const key = process.env.RESEND_API_KEY
  const from = process.env.NOTIFY_FROM
  if (!key || !from) {
    return {
      status: "queued",
      detail: "The inquiry is in the dashboard. The email provider is not configured, so no message was sent.",
    }
  }
  const text = [
    `New ${inquiry.collection} from ${inquiry.company}`,
    `Contact: ${inquiry.contactName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    `Country: ${inquiry.country}`,
    `Destination: ${inquiry.destinationPort || "—"}`,
    `Product: ${inquiry.product}`,
    `Order: ${inquiry.orderType}`,
    `Quantity: ${inquiry.quantity || "—"}`,
    `Packing: ${inquiry.packaging || "—"}`,
    `Locale: ${inquiry.locale}`,
    "",
    inquiry.message,
  ].join("\n")
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: inquiry.email,
        subject: `Asia Oil inquiry · ${inquiry.company}`,
        text,
      }),
    })
    if (!response.ok) return { status: "failed", detail: `Email provider returned ${response.status}. The inquiry is saved.` }
    return { status: "sent", detail: `Sent to ${to}` }
  } catch {
    return { status: "failed", detail: "The email provider could not be reached. The inquiry is saved." }
  }
}
