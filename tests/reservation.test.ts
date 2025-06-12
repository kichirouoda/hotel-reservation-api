import * as reservationService from '../src/services/reservation.service';
import * as reservationModel from '../src/models/reservation.model';
import * as roomModel from '../src/models/room.model';
import * as paymentModel from '../src/models/payment.model';

// Mock the models
jest.mock('../src/models/reservation.model');
jest.mock('../src/models/room.model');
jest.mock('../src/models/payment.model');

describe('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    it('should create a reservation successfully', async () => {
      // Mock data
      const mockRoom = { id: 'room-123', roomTypeId: 'type-123', roomNumber: '101' };
      const mockReservation = {
        id: 'res-123',
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500
      };
      
      // Setup mocks
      (roomModel.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
      (reservationModel.createReservation as jest.Mock).mockResolvedValue(mockReservation);
      
      // Test
      const result = await reservationService.createReservation({
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500
      });
      
      // Assertions
      expect(roomModel.getRoomById).toHaveBeenCalledWith('room-123');
      expect(reservationModel.createReservation).toHaveBeenCalledWith(
        'room-123',
        '2025-06-01',
        '2025-06-05',
        500
      );
      expect(result).toEqual(mockReservation);
    });

    it('should handle initial payment when provided', async () => {
      // Mock data
      const mockRoom = { id: 'room-123', roomTypeId: 'type-123', roomNumber: '101' };
      const mockReservation = {
        id: 'res-123',
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500
      };
      
      // Setup mocks
      (roomModel.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
      (reservationModel.createReservation as jest.Mock).mockResolvedValue(mockReservation);
      (paymentModel.createPayment as jest.Mock).mockResolvedValue({
        id: 'pay-123',
        reservationId: 'res-123',
        amount: 250,
        paidAt: new Date()
      });
      
      // Test
      await reservationService.createReservation({
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500,
        initialPayment: 250
      });
      
      // Assertions
      expect(paymentModel.createPayment).toHaveBeenCalledWith('res-123', 250);
    });

    it('should throw error for invalid dates', async () => {
      // Mock data
      const mockRoom = { id: 'room-123', roomTypeId: 'type-123', roomNumber: '101' };
      
      // Setup mocks
      (roomModel.getRoomById as jest.Mock).mockResolvedValue(mockRoom);
      
      // Test & Assertion
      await expect(reservationService.createReservation({
        roomId: 'room-123',
        checkInDate: '2025-06-05',
        checkOutDate: '2025-06-01', // Invalid: checkout before checkin
        totalAmount: 500
      })).rejects.toThrow('Check-out date must be after check-in date');
    });
  });

  describe('getReservationsByDateRange', () => {
    it('should return reservations that overlap with date range', async () => {
      // Mock data
      const mockReservations = [
        {
          id: 'res-1',
          roomId: 'room-1',
          checkInDate: '2025-06-01',
          checkOutDate: '2025-06-15',
          totalAmount: 1000,
          roomNumber: '101',
          roomTypeName: 'Deluxe'
        },
        {
          id: 'res-2',
          roomId: 'room-2',
          checkInDate: '2025-06-14',
          checkOutDate: '2025-06-16',
          totalAmount: 500,
          roomNumber: '102',
          roomTypeName: 'Standard'
        }
      ];
      
      // Setup mocks
      (reservationModel.getReservationsByDateRange as jest.Mock).mockResolvedValue(mockReservations);
      
      // Test
      const result = await reservationService.getReservationsByDateRange('2025-06-15', '2025-06-15');
      
      // Assertions
      expect(reservationModel.getReservationsByDateRange).toHaveBeenCalledWith('2025-06-15', '2025-06-15');
      expect(result).toEqual(mockReservations);
      expect(result.length).toBe(2);
    });
  });
});
