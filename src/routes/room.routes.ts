import { Router } from 'express';
import * as roomController from '../controllers/room.controller';

const router = Router();

router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom);

router.get('/all-room-types', roomController.getRoomTypes);
router.get('/room-types/:id', roomController.getRoomTypeById);
router.post('/room-types', roomController.createRoomType);

router.get('/:id', roomController.getRoomById);

export default router;