
'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';

const keySecret = "wTWoIllZJzLmeGf5mChheVKW";

const razorpay = new Razorpay({
  key_id: "rzp_live_RM8zaIuw82fOWj",
  key_secret: "wTWoIllZJzLmeGf5mChheVKW",
});

export async function createOrder(amount: number) {
  const options = {
    amount: amount,
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return null;
  }
}

interface VerifyPaymentParams {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export async function verifyPayment(params: VerifyPaymentParams) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return { isValid };
}
