# WarrantyNFT Frontend

A sleek Next.js frontend for the warranty NFT system with a black, silver, and blue color scheme.

## Features

- 🎨 **Modern Design**: Sleek black, silver, and blue color scheme
- 🔍 **Product Search**: Search products by serial number
- 📱 **Responsive**: Mobile-first responsive design
- 🖼️ **IPFS Integration**: Display product images from IPFS
- ⏰ **Warranty Tracking**: Real-time warranty expiration status
- 🚀 **NFT Ready**: Integration with smart contracts for minting

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp env.local.example .env.local
```

Required environment variables:
- `INFURA_IPFS_PROJECT_ID`: Your Infura IPFS project ID
- `INFURA_IPFS_PROJECT_SECRET`: Your Infura IPFS project secret
- `NEXT_PUBLIC_FACTORY_ADDRESS`: Your deployed WarrantyNFTFactory address

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## How It Works

### Product Search Flow

1. **User enters serial number** (e.g., "123456789")
2. **Frontend calls API** `/api/search` with the serial number
3. **API queries SQLite database** for product details
4. **Returns product data** including IPFS image hash
5. **Frontend displays product** with warranty information
6. **User can mint NFT** (wallet integration ready)

### IPFS Integration

The app displays product images stored on IPFS:

- **Image Storage**: Product images are stored on IPFS (InterPlanetary File System)
- **Decentralized**: Images are distributed across the IPFS network
- **Immutable**: Once uploaded, images cannot be changed
- **Gateway Access**: Images are accessed through IPFS gateways

#### Setting Up IPFS

1. **Create Infura IPFS Account**:
   - Go to [Infura](https://infura.io/)
   - Create an account and IPFS project
   - Get your project ID and secret

2. **Upload Images**:
   - Use the IPFS utility functions in `src/lib/ipfs.ts`
   - Images are automatically uploaded to IPFS
   - Hashes are stored in the database

3. **Display Images**:
   - Images are fetched from IPFS gateways
   - Multiple gateway fallbacks for reliability

### Database Schema

The SQLite database stores:

```sql
CREATE TABLE products (
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
);
```

## Sample Data

The app comes with sample data for testing:

- **Serial Number**: `123456789`
- **Product**: Toaster
- **Brand**: Acme
- **Model**: T1000
- **Purchase Date**: August 22, 2025
- **Warranty Expiration**: August 22, 2027

## Customization

### Colors

The color scheme is defined in `tailwind.config.js`:

- **Primary**: Blue tones (`primary-50` to `primary-900`)
- **Silver**: Gray/silver tones (`silver-50` to `silver-900`)
- **Dark**: Dark theme colors (`dark-50` to `dark-900`)

### Components

- **SearchForm**: Product search input
- **ProductCard**: Product display and warranty info
- **Layout**: Header, footer, and main content structure

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Make sure to set all required environment variables in production:

```bash
INFURA_IPFS_PROJECT_ID=your-production-project-id
INFURA_IPFS_PROJECT_SECRET=your-production-project-secret
NEXT_PUBLIC_FACTORY_ADDRESS=your-deployed-factory-address
```

## Tech Stack

- **Frontend**: Next.js 13 with Pages Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: SQLite3
- **IPFS**: Infura IPFS
- **Blockchain**: Wagmi + Viem
- **Language**: TypeScript

## Troubleshooting

### Common Issues

1. **IPFS Images Not Loading**:
   - Check your Infura credentials
   - Verify IPFS gateway URLs
   - Check browser console for errors

2. **Database Errors**:
   - Ensure SQLite is properly installed
   - Check database file permissions
   - Verify database path

3. **Contract Integration**:
   - Ensure factory address is correct
   - Check if contracts are deployed
   - Verify network configuration

## Next Steps

1. **Wallet Integration**: Connect MetaMask or other wallets
2. **NFT Minting**: Implement the minting flow with smart contracts
3. **IPFS Upload**: Add image upload functionality
4. **User Authentication**: Add user accounts and product ownership
5. **Notifications**: Add warranty expiration reminders
