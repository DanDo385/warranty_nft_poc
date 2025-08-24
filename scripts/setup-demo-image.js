const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '..', 'database.db');

// Sample IPFS hash for a toaster image
// This is a placeholder - you'll replace it with your actual hash
const DEMO_IPFS_HASH = 'QmSampleToasterImageHash123';

// Update database with demo image
function updateWithDemoImage() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔄 Setting up demo toaster image...');
  
  db.run(`
    UPDATE products 
    SET ipfs_image_hash = ? 
    WHERE serial_number = '123456789'
  `, [DEMO_IPFS_HASH], function(err) {
    if (err) {
      console.error('❌ Database error:', err);
    } else {
      console.log(`✅ Demo image set up!`);
      console.log(`🔗 IPFS Hash: ${DEMO_IPFS_HASH}`);
      console.log(`🌐 View at: https://ipfs.io/ipfs/${DEMO_IPFS_HASH}`);
      console.log('\n📝 To use a real image:');
      console.log('1. Get your IPFS hash from Infura');
      console.log('2. Run: node scripts/update-ipfs.js');
      console.log('3. Update the hash in the script');
    }
    db.close();
  });
}

// Run the setup
updateWithDemoImage();
