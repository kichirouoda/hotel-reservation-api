import db from './database';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Membuat UUID untuk data awal
const roomTypeIds = {
  standard: uuidv4(),
  deluxe: uuidv4(),
  suite: uuidv4()
};

const roomIds = {
  standard: uuidv4(),
  deluxe: uuidv4(),
  suite: uuidv4()
};

async function seedDatabase() {
  try {
    // Tambahkan data awal
    await seedInitialData();
    console.log('Initial data seeded successfully');
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

async function seedInitialData() {
  try {
    // Tambahkan tipe kamar
    await db.query(`
      INSERT INTO room_types (id, name) VALUES 
      ($1, 'Standard'),
      ($2, 'Deluxe'),
      ($3, 'Suite')
      ON CONFLICT (id) DO NOTHING;
    `, [roomTypeIds.standard, roomTypeIds.deluxe, roomTypeIds.suite]);
    
    // Tambahkan kamar
    await db.query(`
      INSERT INTO rooms (id, room_type_id, room_number) VALUES 
      ($1, $4, '101'),
      ($2, $5, '201'),
      ($3, $6, '301')
      ON CONFLICT (id) DO NOTHING;
    `, [
      roomIds.standard, 
      roomIds.deluxe, 
      roomIds.suite,
      roomTypeIds.standard,
      roomTypeIds.deluxe,
      roomTypeIds.suite
    ]);
    
    console.log('Room types and rooms added successfully');
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
}

// Jalankan seeding dan kemudian tutup koneksi
seedDatabase().then(() => {
  db.end();
  console.log('Database connection closed');
}).catch(err => {
  console.error('Fatal error during seeding:', err);
  db.end();
});
