const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '..', 'database.db');

// Connect to database
const db = new sqlite3.Database(dbPath);

// Update the toaster product with IPFS image hash
const updateToasterImage = () => {
  // Replace this with your actual IPFS hash from IPFS
  const ipfsImageHash = 'bafybeifx5zqeqevlnn4y5pcd45wdujh3lhu7tg6sp6vss5ug3nkuznz2ki';
  
  db.run(`
    UPDATE products 
    SET ipfs_image_hash = ? 
    WHERE serial_number = '123456789'
  `, [ipfsImageHash], function(err) {
    if (err) {
      console.error('Error updating database:', err);
    } else {
      console.log(`✅ Updated toaster image with IPFS hash: ${ipfsImageHash}`);
      console.log(`🌐 Image URL: https://ipfs.io/ipfs/${ipfsImageHash}`);
    }
    db.close();
  });
};

// Run the update
updateToasterImage();
