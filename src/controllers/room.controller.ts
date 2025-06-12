import { Request, Response } from 'express';
import roomService from '../services/room.service';

export async function getRooms(req: Request, res: Response): Promise<void> {
  try {
    const roomTypeId = req.query.roomTypeId as string;
    
    if (roomTypeId) {
      const rooms = await roomService.getRoomsByType(roomTypeId);
      res.status(200).json({status: true, message: "successfully", data: rooms} );
    } else {
      const rooms = await roomService.getAllRooms();
      res.status(200).json({status: true, message: "successfully", data: rooms} );
    }

  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
};

export async function getRoomById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);
    res.status(200).json({status: true, message: "successfully", data: room} );
  } catch (error: any) {
    if (error.message === 'Room not found') {
      res.status(404).json({ status: false, error: error.message });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
};

export async function createRoom(req: Request, res: Response): Promise<void> {
  try {
    const { room_type_id, room_number } = req.body;
    
    if (!room_type_id || !room_number) {
      res.status(400).json({ status: false, error: 'Room type ID and room number are required' });
    }
    
    const room = await roomService.createRoom({ room_type_id, room_number });
    res.status(201).json({status: true, message: "successfully", data: room} );
  } catch (error: any) {
    if (error.message === 'Room type not found') {
      res.status(404).json({ status: false, error: error.message });
    }
    if (error.message === 'Room number already exists') {
      res.status(400).json({ status: false, error: error.message });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
};

export async function getRoomTypes(req: Request, res: Response): Promise<void> {
  try {
    const roomTypes = await roomService.getAllRoomTypes();
    res.status(200).json({status: true, message: "successfully", data: roomTypes} );
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
};

export async function getRoomTypeById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const roomType = await roomService.getRoomTypeById(id);
    res.status(200).json({status: true, message: "successfully", data: roomType} );
  } catch (error: any) {
    if (error.message === 'Room type not found') {
        res.status(404).json({ status: false, error: error.message });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ status: false, error: errorMessage });
  }
};

export async function createRoomType(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      
      if (!name) {
        res.status(400).json({ status: false, error: 'Room type Name are required' });
      }
      
      const room = await roomService.createRoomType({ name });
      res.status(201).json({status: true, message: "successfully", data: room} );
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ status: false, error: errorMessage });
    }
};

export default {
  getRooms,
  getRoomById,
  createRoom,
  getRoomTypes,
  getRoomTypeById,
  createRoomType
};
