import * as reservationModel from '../models/reservation.model';
import * as paymentModel from '../models/payment.model';
import * as roomModel from '../models/room.model';
import { CreateReservationDto, Reservation, ReservationWithRoom } from '../types';

export async function createReservation(data: CreateReservationDto): Promise<Reservation> {
    const { roomId, checkInDate, checkOutDate, totalAmount, initialPayment } = data;
    
    // Validate room exists
    const room = await roomModel.getRoomById(roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    // Validate dates
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      throw new Error('Check-out date must be after check-in date');
    }
    
    // Check if room is available for the requested dates
    const existingReservations = await reservationModel.getReservationsByRoomAndDateRange(
      roomId,
      checkInDate,
      checkOutDate
    );
    
    if (existingReservations && existingReservations.length > 0) {
      throw new Error(`Room is not available from ${new Date(checkInDate).toLocaleDateString()} to ${new Date(checkOutDate).toLocaleDateString()}`);
    }
    
    // Create reservation
    const reservation = await reservationModel.createReservation(
      roomId,
      checkInDate,
      checkOutDate,
      totalAmount
    );
    
    // Handle initial payment if provided
    if (initialPayment && initialPayment > 0) {
      if (initialPayment / totalAmount < 0.5) {
        await reservationModel.deleteReservation(reservation.id);
        throw new Error('Initial payment minimum 50%');
      }

      if(initialPayment > totalAmount){
        await reservationModel.deleteReservation(reservation.id);
        throw new Error('initialPayment cannot be more than totalAmount');
      }
      await paymentModel.createPayment(reservation.id, initialPayment);
    }
    
    return reservation;
}

export async function getReservationById(id: string): Promise<ReservationWithRoom | null> {
  return reservationModel.getReservationById(id);
}

export async function getReservationsByDateRange(
  startDate: string,
  endDate: string
): Promise<ReservationWithRoom[]> {
  return reservationModel.getReservationsByDateRange(startDate, endDate);
}

export async function getReservationBalance(id: string): Promise<{ 
  totalAmount: number; 
  paidAmount: number; 
  outstandingBalance: number 
}> {
  const reservation = await reservationModel.getReservationWithPayments(id);
  if (!reservation) {
    throw new Error('Reservation not found');
  }
  
  const totalAmount = reservation.totalAmount;
  const paidAmount = await paymentModel.getTotalPaidAmount(id);
  const outstandingBalance = totalAmount - paidAmount;
  
  return {
    totalAmount,
    paidAmount,
    outstandingBalance
  };
}
