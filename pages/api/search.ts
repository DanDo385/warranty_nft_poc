import { NextApiRequest, NextApiResponse } from 'next';
import { getDb, Product } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { serialNumber } = req.body;

    if (!serialNumber) {
      return res.status(400).json({ message: 'Serial number is required' });
    }

    const db = getDb();
    
    // Search for product by serial number
    db.get(
      'SELECT * FROM products WHERE serial_number = ?',
      [serialNumber],
      (err, row: Product) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database error' });
        }

        if (!row) {
          return res.status(404).json({ message: 'Product not found' });
        }

        // Return product data
        res.status(200).json({
          success: true,
          product: {
            id: row.id,
            serial_number: row.serial_number,
            product_name: row.product_name,
            brand_name: row.brand_name,
            model_number: row.model_number,
            purchase_date: row.purchase_date,
            warranty_length_days: row.warranty_length_days,
            warranty_expiration_date: row.warranty_expiration_date,
            ipfs_image_hash: row.ipfs_image_hash,
            ipfs_metadata_hash: row.ipfs_metadata_hash,
          }
        });
      }
    );
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
