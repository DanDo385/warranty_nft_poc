const { create } = require('ipfs-http-client');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// IPFS configuration - NFT.Storage (optional token)
const nftStorageToken = process.env.NFT_STORAGE_TOKEN || '';

// Note: NFT.Storage free tier works without a token
if (!nftStorageToken) {
  console.log('ℹ️  No NFT.Storage token found. Using free tier (limited uploads).');
  console.log('📝 Get a token from https://nft.storage/ for unlimited uploads.');
}

const client = create({
  host: 'api.nft.storage',
  port: 443,
  protocol: 'https',
  headers: nftStorageToken ? {
    'Authorization': `Bearer ${nftStorageToken}`,
  } : {},
});

// Database path
const dbPath = path.join(__dirname, '..', 'database.db');

// Upload image to IPFS
async function uploadImageToIPFS(imagePath) {
  try {
    console.log(`📤 Uploading ${imagePath} to IPFS...`);
    
    const fileBuffer = fs.readFileSync(imagePath);
    const added = await client.add(fileBuffer);
    
    console.log(`✅ Image uploaded successfully!`);
    console.log(`🔗 IPFS Hash: ${added.path}`);
    console.log(`🌐 View at: https://ipfs.io/ipfs/${added.path}`);
    
    return added.path;
  } catch (error) {
    console.error('❌ Error uploading to IPFS:', error);
    throw error;
  }
}

// Update database with IPFS hash
function updateDatabase(ipfsHash) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    
    db.run(`
      UPDATE products 
      SET ipfs_image_hash = ? 
      WHERE serial_number = '123456789'
    `, [ipfsHash], function(err) {
      if (err) {
        console.error('❌ Database error:', err);
        reject(err);
      } else {
        console.log(`✅ Database updated with IPFS hash: ${ipfsHash}`);
        resolve();
      }
      db.close();
    });
  });
}

// Main function
async function main() {
  try {
    // Check if image file exists
    const imagePath = path.join(__dirname, 'toaster.jpg'); // or .png
    
    if (!fs.existsSync(imagePath)) {
      console.log('📝 No image file found. Creating sample image...');
      console.log('📁 Please place your toaster image in: scripts/toaster.jpg');
      console.log('🔄 Or update the imagePath variable in this script');
      return;
    }
    
    // Upload to IPFS
    const ipfsHash = await uploadImageToIPFS(imagePath);
    
    // Update database
    await updateDatabase(ipfsHash);
    
    console.log('\n🎉 Success! Your toaster image is now on IPFS!');
    console.log(`🔍 Search for serial number "123456789" to see it in action`);
    
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
