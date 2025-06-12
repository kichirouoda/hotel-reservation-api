import * as paymentModel from '../models/payment.model';
import * as reservationModel from '../models/reservation.model';
import { Payment, CreatePaymentDto } from '../types';

export async function addPayment(
  reservationId: string,
  paymentData: CreatePaymentDto
): Promise<Payment> {
  const { amount } = paymentData;
  
  // Validate reservation exists
  const reservation = await reservationModel.getReservationById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  
  // Validate amount is positive
  if (amount <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }
  
  // Check if payment exceeds outstanding balance
  const { outstandingBalance } = await getReservationBalanceInfo(reservationId);
  if (amount > outstandingBalance) {
    throw new Error('Payment amount exceeds outstanding balance');
  }
  
  // Create payment
  return paymentModel.createPayment(reservationId, amount);
}

export async function getReservationBalanceInfo(reservationId: string): Promise<{
    totalAmount: number;
    paidAmount: number;
    outstandingBalance: number;
  }> {
    const reservation = await reservationModel.getReservationById(reservationId);
    
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Gunakan properti yang sudah dikonversi
    const totalAmount = reservation.totalAmount;
    const paidAmount = await paymentModel.getTotalPaidAmount(reservationId);
    const outstandingBalance = totalAmount - paidAmount;
    
    return {
      totalAmount,
      paidAmount,
      outstandingBalance
    };
  }
