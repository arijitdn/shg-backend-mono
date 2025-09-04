import { Injectable } from '@nestjs/common';
const Razorpay = require('razorpay');
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error(
        'Razorpay credentials not found in environment variables',
      );
    }

    this.razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  async createOrder(
    amount: number,
    currency: string = 'INR',
    receipt?: string,
  ) {
    try {
      const options = {
        amount: amount / 100, // amount in smallest currency unit (paisa for INR)
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      const order = await this.razorpay.orders.create(options);
      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        message: 'Failed to create payment order',
        error: error.message,
      };
    }
  }

  verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    try {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error('Razorpay key secret not found');
      }

      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === razorpaySignature;

      return {
        success: isValid,
        message: isValid
          ? 'Payment verified successfully'
          : 'Payment verification failed',
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        message: 'Payment verification failed',
        error: error.message,
      };
    }
  }

  async getPayment(paymentId: string) {
    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      return {
        success: true,
        payment,
      };
    } catch (error) {
      console.error('Error fetching payment:', error);
      return {
        success: false,
        message: 'Failed to fetch payment details',
        error: error.message,
      };
    }
  }

  async getOrder(orderId: string) {
    try {
      const order = await this.razorpay.orders.fetch(orderId);
      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        message: 'Failed to fetch order details',
        error: error.message,
      };
    }
  }
}
