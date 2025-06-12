import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';
import { CreatePaymentDto } from '../types';

export async function addPayment(req: Request, res: Response): Promise<void> {
  try {
    const { id: reservationId } = req.params;
    const paymentData: CreatePaymentDto = req.body;
    
    // Validate payment amount
    if (!paymentData.amount || typeof paymentData.amount !== 'number' || paymentData.amount <= 0) {
      res.status(400).json({ status: false, error: 'Valid payment amount is required' });
      return;
    }
    
    const payment = await paymentService.addPayment(reservationId, paymentData);
    const balanceInfo = await paymentService.getReservationBalanceInfo(reservationId);
    
    res.status(201).json({
        status: true,
        message: "successfully",
        data: {
            payment,
            balanceInfo
        }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
}
