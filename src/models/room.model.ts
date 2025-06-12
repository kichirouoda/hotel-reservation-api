import { v4 as uuidv4 } from 'uuid';
import db from '../config/database';
import { Room, RoomWithType, RoomType } from '../types';

export const getRooms = async (): Promise<RoomWithType[]> => {
    const result = await db.query(`
      SELECT r.id, r.room_number, r.room_type_id, rt.name as room_type_name, r.created_at
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY r.room_number
    `);
    return result.rows;
  };

export const getRoomById = async (id: string): Promise<RoomWithType | null> => {
    const result = await db.query(`
      SELECT r.id, r.room_number, r.room_type_id, rt.name as room_type_name, r.created_at
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = $1
    `, [id]);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  };
  
  export const getRoomsByType = async (roomTypeId: string): Promise<RoomWithType[]> => {
    const result = await db.query(`
      SELECT r.id, r.room_number, r.room_type_id, rt.name as room_type_name, r.created_at
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.room_type_id = $1
      ORDER BY r.room_number
    `, [roomTypeId]);
    
    return result.rows;
  };
  
  export const createRoom = async (room: { room_type_id: string; room_number: string }): Promise<Room> => {
    const id = uuidv4();
    const result = await db.query(`
      INSERT INTO rooms (id, room_type_id, room_number)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [id, room.room_type_id, room.room_number]);
    
    return result.rows[0];
  };
  
  export const getRoomTypes = async (): Promise<RoomType[]> => {
    const result = await db.query('SELECT * FROM room_types ORDER BY name');
    return result.rows;
  };
  
  export const getRoomTypeById = async (id: string): Promise<RoomType | null> => {
    const result = await db.query('SELECT * FROM room_types WHERE id = $1', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
  };

  export const createRoomType = async (room: { name: string }): Promise<Room> => {
    const id = uuidv4();
    const result = await db.query(`
      INSERT INTO room_types (id, name)
      VALUES ($1, $2)
      RETURNING *
    `, [id, room.name]);
    
    return result.rows[0];
  };
  
  export default {
    getRooms,
    getRoomById,
    getRoomsByType,
    createRoom,
    getRoomTypes,
    getRoomTypeById,
    createRoomType
  };
