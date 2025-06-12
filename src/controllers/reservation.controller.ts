import { Request, Response } from 'express';
import * as reservationService from '../services/reservation.service';
import * as paymentService from '../services/payment.service';
import { CreateReservationDto } from '../types';

export async function createReservation(req: Request, res: Response): Promise<void> {
  try {
    const reservationData: CreateReservationDto = req.body;

    // Validate required fields
    if (!reservationData.roomId || !reservationData.checkInDate || 
        !reservationData.checkOutDate || !reservationData.totalAmount) {
      res.status(400).json({ status: false, error: 'Missing required fields' });
      return;
    }
    
    const reservation = await reservationService.createReservation(reservationData);
    const reservationId = reservation.id;
    const balanceInfo = await paymentService.getReservationBalanceInfo(reservationId);

    const formattedReservation = {
        ...reservation,
        check_in_date: reservationData.checkInDate,
        check_out_date: reservationData.checkOutDate,
    };
    
    res.status(201).json({
        status: true,
        message: "successfully",
        data: {
            reservation: formattedReservation,
            balanceInfo
        }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
}

export async function getReservations(req: Request, res: Response): Promise<void> {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate date parameters
    if (!startDate || !endDate) {
      res.status(400).json({ status: false, error: 'startDate and endDate query parameters are required' });
      return;
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate as string) || !dateRegex.test(endDate as string)) {
      res.status(400).json({ status: false, error: 'Dates must be in YYYY-MM-DD format' });
      return;
    }
    
    const reservations = await reservationService.getReservationsByDateRange(
      startDate as string,
      endDate as string
    );
    
    res.status(200).json({status: true, message: "successfully", data: reservations});
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ status: false, error: errorMessage });
  }
}

export async function getReservationDetails(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const reservation = await reservationService.getReservationById(id);
    
    if (!reservation) {
      res.status(404).json({ status: false, error: 'Reservation not found' });
      return;
    }
    
    const balance = await reservationService.getReservationBalance(id);
    
    res.status(200).json({
        status: true,
        message: "successfully", 
        data: {
            ...reservation,
            ...balance
        }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ status: false, error: errorMessage });
  }
}
