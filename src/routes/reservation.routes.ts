import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.post('/', reservationController.createReservation);
router.get('/', reservationController.getReservations);
router.get('/:id', reservationController.getReservationDetails);
router.post('/:id/payments', paymentController.addPayment);


export default router;
