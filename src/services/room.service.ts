import roomModel from '../models/room.model';

export const getAllRooms = async () => {
  return await roomModel.getRooms();
};

export const getRoomById = async (id: string) => {
  const room = await roomModel.getRoomById(id);
  if (!room) {
    throw new Error('Room not found');
  }
  return room;
};

export const getRoomsByType = async (roomTypeId: string) => {
  const roomType = await roomModel.getRoomTypeById(roomTypeId);
  if (!roomType) {
    throw new Error('Room type not found');
  }
  return await roomModel.getRoomsByType(roomTypeId);
};

export const createRoom = async (roomData: { room_type_id: string; room_number: string }) => {
  const roomType = await roomModel.getRoomTypeById(roomData.room_type_id);
  if (!roomType) {
    throw new Error('Room type not found');
  }
  
  // Check if room number already exists
  const rooms = await roomModel.getRooms();
  const roomExists = rooms.some(room => room.room_number === roomData.room_number);
  if (roomExists) {
    throw new Error('Room number already exists');
  }
  
  return await roomModel.createRoom(roomData);
};

export const getAllRoomTypes = async () => {
  return await roomModel.getRoomTypes();
};

export const getRoomTypeById = async (id: string) => {
  const roomType = await roomModel.getRoomTypeById(id);
  if (!roomType) {
    throw new Error('Room type not found');
  }
  return roomType;
};

export const createRoomType = async (roomData: { name: string }) => {
    const roomTypes = await roomModel.getRoomTypes();
    const nameExists = roomTypes.some(roomType => 
        roomType.name.toLowerCase() === roomData.name.toLowerCase()
    );
    if (nameExists) {
        throw new Error('Room type name already exists');
    }
    return await roomModel.createRoomType(roomData);
};

export default {
  getAllRooms,
  getRoomById,
  getRoomsByType,
  createRoom,
  getAllRoomTypes,
  getRoomTypeById,
  createRoomType
};
