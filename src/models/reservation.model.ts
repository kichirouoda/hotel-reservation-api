import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { Reservation, ReservationWithRoom } from '../types';

export async function createReservation(
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
  totalAmount: number
): Promise<Reservation> {
  const id = uuidv4();
  const result = await db.query(
    `INSERT INTO reservations 
     (id, room_id, check_in_date, check_out_date, total_amount) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [id, roomId, checkInDate, checkOutDate, totalAmount]
  );
  return result.rows[0];
}

export async function getReservationById(id: string): Promise<any> {
    const result = await db.query(
      `SELECT r.*, rm.room_number, rt.name as room_type_name,
       TO_CHAR(r.check_in_date, 'YYYY-MM-DD') as formatted_check_in_date,
       TO_CHAR(r.check_out_date, 'YYYY-MM-DD') as formatted_check_out_date,
       TO_CHAR(r.created_at, 'YYYY-MM-DD') as formatted_created_at
       FROM reservations r
       JOIN rooms rm ON r.room_id = rm.id
       JOIN room_types rt ON rm.room_type_id = rt.id
       WHERE r.id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Transformasi data dari snake_case ke camelCase
    const row = result.rows[0];
    return {
      id: row.id,
      roomId: row.room_id,
      checkInDate: row.formatted_check_in_date,
      checkOutDate: row.formatted_check_out_date,
      totalAmount: parseFloat(row.total_amount),
      createdAt: row.formatted_created_at,
      roomNumber: row.room_number,
      roomTypeName: row.room_type_name,
      // Tetap sertakan properti asli untuk kompatibilitas
      total_amount: row.total_amount
    };
}

// export async function getReservationsByDateRange(
//     startDate: string,
//     endDate: string
//   ): Promise<ReservationWithRoom[]> {
//     // Mendapatkan data reservasi
//     const reservationsResult = await db.query(
//       `SELECT r.*, rm.room_number, rt.name as room_type_name,
//        TO_CHAR(r.check_in_date, 'YYYY-MM-DD') as formatted_check_in_date,
//        TO_CHAR(r.check_out_date, 'YYYY-MM-DD') as formatted_check_out_date,
//        TO_CHAR(r.created_at, 'YYYY-MM-DD') as formatted_created_at
//        FROM reservations r
//        JOIN rooms rm ON r.room_id = rm.id
//        JOIN room_types rt ON rm.room_type_id = rt.id
//       WHERE 
//       (
//         r.check_in_date BETWEEN $1 AND $2
//         OR r.check_out_date BETWEEN $1 AND $2
//         OR $1 BETWEEN r.check_in_date AND r.check_out_date
//         OR $2 BETWEEN r.check_in_date AND r.check_out_date
//       )`,
//       [startDate, endDate]
//     );
    
//     // Jika tidak ada reservasi yang ditemukan, kembalikan array kosong
//     if (reservationsResult.rows.length === 0) {
//       return [];
//     }
    
//     // Mendapatkan ID semua reservasi untuk query pembayaran
//     const reservationIds = reservationsResult.rows.map(row => row.id);
    
//     // Query untuk mendapatkan total pembayaran untuk setiap reservasi
//     const paymentsResult = await db.query(
//       `SELECT reservation_id, COALESCE(SUM(amount), 0) as paid_amount
//        FROM payments
//        WHERE reservation_id = ANY($1)
//        GROUP BY reservation_id`,
//       [reservationIds]
//     );
    
//     // Membuat map untuk mempermudah akses data pembayaran
//     const paymentMap = new Map();
//     paymentsResult.rows.forEach(row => {
//       paymentMap.set(row.reservation_id, parseFloat(row.paid_amount));
//     });
    
//     // Transform each row to match the desired response format
//     return reservationsResult.rows.map(row => {
//       const totalAmount = parseFloat(row.total_amount);
//       const paidAmount = paymentMap.get(row.id) || 0;
//       const outstandingBalance = totalAmount - paidAmount;
      
//       return {
//         id: row.id,
//         roomId: row.room_id,
//         checkInDate: row.formatted_check_in_date,
//         checkOutDate: row.formatted_check_out_date,
//         totalAmount: totalAmount,
//         createdAt: row.formatted_created_at,
//         roomNumber: row.room_number,
//         roomTypeName: row.room_type_name,
//         paidAmount: paidAmount,
//         outstandingBalance: outstandingBalance,
//         // Tetap sertakan properti asli untuk kompatibilitas
//         total_amount: row.total_amount
//       };
//     });
// }

export async function getReservationsByDateRange(
  startDate: string,
  endDate: string
): Promise<ReservationWithRoom[]> {

  const reservationsResult = await db.query(
    `SELECT 
      r.id, 
      r.room_id, 
      r.total_amount,
      TO_CHAR(r.check_in_date, 'YYYY-MM-DD') AS formatted_check_in_date,
      TO_CHAR(r.check_out_date, 'YYYY-MM-DD') AS formatted_check_out_date,
      TO_CHAR(r.created_at, 'YYYY-MM-DD') AS formatted_created_at,
      rm.room_number,
      rt.name AS room_type_name,
      COALESCE(p.paid_amount, 0) AS paid_amount,
      (r.total_amount - COALESCE(p.paid_amount, 0)) AS outstanding_balance
    FROM reservations r
    JOIN rooms rm ON r.room_id = rm.id
    JOIN room_types rt ON rm.room_type_id = rt.id
    LEFT JOIN (
      SELECT reservation_id, SUM(amount) AS paid_amount
      FROM payments
      GROUP BY reservation_id
    ) p ON r.id = p.reservation_id
    WHERE 
      (
        r.check_in_date BETWEEN $1 AND $2
        OR r.check_out_date BETWEEN $1 AND $2
        OR $1 BETWEEN r.check_in_date AND r.check_out_date
        OR $2 BETWEEN r.check_in_date AND r.check_out_date
      )`,
    [startDate, endDate]
  );

  if (reservationsResult.rows.length === 0) {
    return [];
  }

  return reservationsResult.rows.map(row => ({
    id: row.id,
    roomId: row.room_id,
    checkInDate: row.formatted_check_in_date,
    checkOutDate: row.formatted_check_out_date,
    totalAmount: parseFloat(row.total_amount),
    createdAt: row.formatted_created_at,
    roomNumber: row.room_number,
    roomTypeName: row.room_type_name,
    paidAmount: parseFloat(row.paid_amount),
    outstandingBalance: parseFloat(row.outstanding_balance),
    total_amount: row.total_amount 
  }));
}

export async function getReservationWithPayments(id: string): Promise<Reservation | null> {
    const result = await db.query(`
      SELECT r.*, json_agg(p.*) as payments
      FROM reservations r
      LEFT JOIN payments p ON r.id = p.reservation_id
      WHERE r.id = $1
      GROUP BY r.id
    `, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Transform snake_case to camelCase
    const row = result.rows[0];
    return {
      id: row.id,
      roomId: row.room_id,
      checkInDate: row.check_in_date,
      checkOutDate: row.check_out_date,
      totalAmount: parseFloat(row.total_amount),

      payments: row.payments && row.payments[0] !== null ? row.payments.map((p: any) => ({
        id: p.id,
        reservationId: p.reservation_id,
        amount: parseFloat(p.amount),
        paidAt: p.paid_at
      })) : []
    };
};

export async function getReservationsByRoomAndDateRange(
    roomId: string,
    checkInDate: string | Date,
    checkOutDate: string | Date
  ): Promise<Reservation[]> {
    try {
      // Konversi string ke Date jika perlu
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      
      // Query untuk mencari reservasi yang overlap dengan rentang tanggal yang diminta
      const result = await db.query(
        `SELECT * FROM reservations 
         WHERE room_id = $1 
         AND (
           (check_in_date <= $2 AND check_out_date > $2) OR
           (check_in_date < $3 AND check_out_date >= $3) OR
           (check_in_date >= $2 AND check_out_date <= $3)
         )`,
        [roomId, startDate, endDate]
      );
      
      return result.rows;
    } catch (error) {
      console.error('Error checking room availability:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to check room availability: ${error.message}`);
      } else {
        throw new Error('Failed to check room availability: Unknown error');
      }
    }
}

export const deleteReservation = async (id: string): Promise<boolean> => {
    try {
      const result = await db.query(
        'DELETE FROM reservations WHERE id = $1 RETURNING id',
        [id]
      );
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete reservation: ${error.message}`);
      } else {
        throw new Error('Failed to delete reservation: Unknown error');
      }
    }
};
