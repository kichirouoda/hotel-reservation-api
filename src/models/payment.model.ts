import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { Payment } from '../types';

export async function createPayment(
  reservationId: string,
  amount: number
): Promise<Payment> {
  const id = uuidv4();
  await db.query(
    'INSERT INTO payments (id, reservation_id, amount) VALUES ($1, $2, $3) RETURNING *',
    [id, reservationId, amount]
  );

  const result = await db.query(
    `SELECT 
      p.id, 
      p.reservation_id, 
      p.amount, 
      TO_CHAR(p.paid_at, 'YYYY-MM-DD') as paid_at
    FROM payments p
    WHERE p.id = $1`,
    [id]
  );

  return result.rows[0];
}

export async function getPaymentsByReservationId(reservationId: string): Promise<Payment[]> {
  const result = await db.query(
    'SELECT * FROM payments WHERE reservation_id = $1 ORDER BY paid_at',
    [reservationId]
  );
  return result.rows;
}

export async function getTotalPaidAmount(reservationId: string): Promise<number> {
  const result = await db.query(
    'SELECT SUM(amount) as total FROM payments WHERE reservation_id = $1',
    [reservationId]
  );
  return parseFloat(result.rows[0].total) || 0;
}
