import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Yahan humne naye address fields extract kar liye hain
    const { name, email, phone, billingAddress, shippingAddress, message } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email ki body me Address details add kar di gayi hain
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CLIENT_EMAIL,
      replyTo: email,
      subject: "New Customer Part Request - Auto Parts",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ccc; padding-bottom: 10px;">New Part Request</h2>
          
          <h3 style="color: #555;">Customer Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          
          <h3 style="color: #555;">Addresses</h3>
          <p><strong>Billing Address:</strong><br/> ${billingAddress}</p>
          <p><strong>Shipping Address:</strong><br/> ${shippingAddress}</p>
          
          <h3 style="color: #555;">Additional Notes</h3>
          <p>${message || 'No additional notes provided.'}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send email." }, { status: 500 });
  }
}