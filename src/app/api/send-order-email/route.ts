
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Order } from '@/lib/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.ORDER_NOTIFICATION_EMAIL;
const fromEmail = 'onboarding@resend.dev'; // Resend requires a verified domain or this default address

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Resend API key is not configured.");
    return NextResponse.json({ error: 'This feature is not configured.' }, { status: 500 });
  }
   if (!toEmail) {
    console.error("Order notification email recipient is not configured.");
    return NextResponse.json({ error: 'This feature is not configured.' }, { status: 500 });
  }

  try {
    const order = await request.json() as Order;

    if (!order || !order.orderId) {
      return NextResponse.json({ error: 'Invalid order data received.' }, { status: 400 });
    }

    const emailHtml = `
      <div>
        <h1>New Order Received!</h1>
        <p>You've received a new order on ArtGhar. Here are the details:</p>
        <p><strong>Order ID:</strong> #${order.orderId.substring(0, 7).toUpperCase()}</p>
        <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
        <p><strong>Total Amount:</strong> ₹${order.total.toFixed(2)}</p>
        <h2>Items:</h2>
        <ul>
          ${order.products.map(p => `<li>${p.quantity}x ${p.name}</li>`).join('')}
        </ul>
        <p>You can view the full order details in your admin dashboard.</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `ArtGhar <${fromEmail}>`,
      to: [toEmail],
      subject: `New Order Notification: #${order.orderId.substring(0, 7).toUpperCase()}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending email via Resend:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data });

  } catch (error: any) {
    console.error('Error in send-order-email API route:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

    