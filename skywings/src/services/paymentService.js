import BaseService from './baseService';
import api from './apiClient';

class PaymentService extends BaseService {
  constructor() {
    super('payments');
  }

  async processPayment(bookingId, paymentDetails) {
    try {
      // Get booking details
      const booking = await api.get(`/bookings/${bookingId}`);
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.paymentStatus === 'paid') {
        throw new Error('Payment already processed for this booking');
      }

      // In a real app, this would interact with a payment gateway
      const payment = await this.create({
        bookingId,
        amount: booking.totalAmount,
        paymentMethod: paymentDetails.paymentMethod,
        status: 'completed',
        transactionId: `TXN${Date.now()}`,
        paymentDate: new Date().toISOString(),
        ...paymentDetails
      });

      // Update booking payment status
      await api.patch(`/bookings/${bookingId}`, {
        paymentStatus: 'paid',
        status: 'confirmed'
      });

      return payment;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async getPaymentByBookingId(bookingId) {
    try {
      const payments = await this.getAll({ bookingId });
      return payments[0]; // Assuming one payment per booking
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  }

  async refundPayment(paymentId) {
    try {
      const payment = await this.getById(paymentId);
      
      // In a real app, this would interact with a payment gateway
      const refund = await this.update(paymentId, {
        status: 'refunded',
        refundDate: new Date().toISOString()
      });

      return refund;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  async getPaymentHistory(userId, params = {}) {
    try {
      // First get user's bookings
      const bookings = await api.get(`/bookings?userId=${userId}`);
      const bookingIds = bookings.map(booking => booking.id);
      
      // Then get payments for those bookings
      return await this.getAll({
        ...params,
        bookingId: bookingIds
      });
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }
}

export default new PaymentService();
