export const runtime = "nodejs";
import nodemailer from "nodemailer";

interface EmailRequestBody {
  recipients: string[];
  subject: string;
  message: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { recipients, subject, message }: EmailRequestBody = await req.json();

    if (!recipients || recipients.length === 0) {
      return new Response(JSON.stringify({ error: "Alıcı listesi boş" }), {
        status: 400,
      });
    }

    if (!subject || !message) {
      return new Response(JSON.stringify({ error: "Konu ve mesaj gerekli" }), {
        status: 400,
      });
    }

    // SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465, // 465 ise true, 587 ise false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail gönder
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients.join(", "),
      subject,
      text: message,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return new Response(JSON.stringify({ error: "Mail gönderilemedi." }), {
      status: 500,
    });
  }
}
