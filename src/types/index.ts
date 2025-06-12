export interface RoomType {
    id: string;
    name: string;
    created_at?: Date;
  }
  
  export interface Room {
    id: string;
    room_type_id: string;
    room_number: string;
    created_at?: Date;
  }
  
  export interface RoomWithType extends Room {
    room_type_name: string;
  }
  
  export interface Payment {
    id: string;
    reservationId: string;
    amount: number;
    paidAt: Date;
  }
  
  export interface Reservation {
    id: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    payments?: Payment[];
  }
  
  export interface ReservationWithRoom extends Reservation {
    roomNumber: string;
    roomTypeName: string;
  }
  
  export interface CreateReservationDto {
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    initialPayment?: number;
  }
  
  export interface CreatePaymentDto {
    amount: number;
  }
  