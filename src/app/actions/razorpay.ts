'use server';

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Hardcoding keys as a definitive fix for the environment variable issue.
const keyId = "rzp_live_RM8zaIuw82fOWj";
const keySecret = "wTWoIllZJzLmeGf5mChheVKW";

if (!keyId || !keySecret) {
  // This check is now redundant but kept for safety.
  throw new Error('Razorpay API keys are not defined.');
}

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
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
        .createHmac('sha256', keySecret!)
        .update(body.toString())
        .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    return { isValid };
}
