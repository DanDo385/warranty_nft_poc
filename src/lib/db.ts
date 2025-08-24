import sqlite3 from 'sqlite3';
import path from 'path';

// Database path
const dbPath = path.join(process.cwd(), 'database.db');

// Initialize database
let _db: sqlite3.Database | null = null;

export function getDb(): sqlite3.Database {
  if (!_db) {
    _db = new sqlite3.Database(dbPath);
    _db.serialize(() => {
      // Create products table
      _db!.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          serial_number TEXT UNIQUE NOT NULL,
          product_name TEXT NOT NULL,
          brand_name TEXT NOT NULL,
          model_number TEXT NOT NULL,
          purchase_date TEXT NOT NULL,
          warranty_length_days INTEGER NOT NULL,
          warranty_expiration_date TEXT NOT NULL,
          ipfs_image_hash TEXT,
          ipfs_metadata_hash TEXT
        )
      `);

      // Seed with sample data if table is empty
      _db!.get("SELECT COUNT(*) as count FROM products", (err, row: any) => {
        if (err) {
          console.error('Error checking products count:', err);
          return;
        }
        
        if (row.count === 0) {
          // Insert sample toaster product
          const purchaseDate = '2025-08-22';
          const warrantyLengthDays = 730; // 2 years
          const expirationDate = '2027-08-22';
          
          _db!.run(`
            INSERT INTO products (
              serial_number, product_name, brand_name, model_number, 
              purchase_date, warranty_length_days, warranty_expiration_date,
              ipfs_image_hash, ipfs_metadata_hash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            '123456789',
            'Toaster',
            'Acme',
            'T1000',
            purchaseDate,
            warrantyLengthDays,
            expirationDate,
            'bafybeifx5zqeqevlnn4y5pcd45wdujh3lhu7tg6sp6vss5ug3nkuznz2ki', // Actual IPFS hash from user
            'QmSampleMetadataHash456' // This will be replaced with actual IPFS hash
          ], (err) => {
            if (err) {
              console.error('Error seeding database:', err);
            } else {
              console.log('Database seeded with sample product');
            }
          });
        }
      });
    });
  }
  return _db;
}

export function closeDb() {
  if (_db) {
    _db.close();
    _db = null;
  }
}

// Product interface
export interface Product {
  id: number;
  serial_number: string;
  product_name: string;
  brand_name: string;
  model_number: string;
  purchase_date: string;
  warranty_length_days: number;
  warranty_expiration_date: string;
  ipfs_image_hash?: string;
  ipfs_metadata_hash?: string;
}
