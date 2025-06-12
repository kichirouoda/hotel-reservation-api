import * as paymentService from '../src/services/payment.service';
import * as paymentModel from '../src/models/payment.model';
import * as reservationModel from '../src/models/reservation.model';

// Mock the models
jest.mock('../src/models/payment.model');
jest.mock('../src/models/reservation.model');

describe('Payment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addPayment', () => {
    it('should add a payment successfully', async () => {
      // Mock data
      const mockReservation = {
        id: 'res-123',
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500,
        roomNumber: '101',
        roomTypeName: 'Deluxe'
      };
      
      const mockPayment = {
        id: 'pay-123',
        reservationId: 'res-123',
        amount: 200,
        paidAt: new Date()
      };
      
      // Setup mocks
      (reservationModel.getReservationById as jest.Mock).mockResolvedValue(mockReservation);
      (paymentModel.getTotalPaidAmount as jest.Mock).mockResolvedValue(0);
      (paymentModel.createPayment as jest.Mock).mockResolvedValue(mockPayment);
      
      // Test
      const result = await paymentService.addPayment('res-123', { amount: 200 });
      
      // Assertions
      expect(reservationModel.getReservationById).toHaveBeenCalledWith('res-123');
      expect(paymentModel.createPayment).toHaveBeenCalledWith('res-123', 200);
      expect(result).toEqual(mockPayment);
    });

    it('should throw error if payment exceeds outstanding balance', async () => {
      // Mock data
      const mockReservation = {
        id: 'res-123',
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500,
        roomNumber: '101',
        roomTypeName: 'Deluxe'
      };
      
      // Setup mocks
      (reservationModel.getReservationById as jest.Mock).mockResolvedValue(mockReservation);
      (paymentModel.getTotalPaidAmount as jest.Mock).mockResolvedValue(400); // Already paid 400
      
      // Test & Assertion
      await expect(paymentService.addPayment('res-123', { amount: 200 }))
        .rejects.toThrow('Payment amount exceeds outstanding balance');
    });
  });

  describe('getReservationBalanceInfo', () => {
    it('should calculate balance correctly', async () => {
      // Mock data
      const mockReservation = {
        id: 'res-123',
        roomId: 'room-123',
        checkInDate: '2025-06-01',
        checkOutDate: '2025-06-05',
        totalAmount: 500,
        roomNumber: '101',
        roomTypeName: 'Deluxe'
      };
      
      // Setup mocks
      (reservationModel.getReservationById as jest.Mock).mockResolvedValue(mockReservation);
      (paymentModel.getTotalPaidAmount as jest.Mock).mockResolvedValue(300);
      
      // Test
      const result = await paymentService.getReservationBalanceInfo('res-123');
      
      // Assertions
      expect(result).toEqual({
        totalAmount: 500,
        paidAmount: 300,
        outstandingBalance: 200
      });
    });
  });
});
