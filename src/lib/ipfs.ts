// IPFS configuration - using Pinata (your current IPFS provider)
const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const pinataSecretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY || '';

// Debug: Log the API keys (remove this in production)
console.log('Pinata API Key:', pinataApiKey ? `${pinataApiKey.substring(0, 8)}...` : 'NOT SET');
console.log('Pinata Secret Key:', pinataSecretKey ? `${pinataSecretKey.substring(0, 8)}...` : 'NOT SET');

// Pinata API endpoints
const PINATA_API_URL = 'https://api.pinata.cloud';

// Upload file to IPFS via Pinata
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

// Upload JSON metadata to IPFS via Pinata
export async function uploadMetadataToIPFS(metadata: any): Promise<string> {
  try {
    const data = JSON.stringify(metadata);
    
    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: data,
    });
    
    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

// Get IPFS gateway URL
export function getIPFSGatewayURL(hash: string): string {
  // You can use different IPFS gateways
  const gateways = [
    `https://ipfs.io/ipfs/${hash}`,
    `https://gateway.pinata.cloud/ipfs/${hash}`,
    `https://cloudflare-ipfs.com/ipfs/${hash}`,
  ];
  
  // Return the first gateway (you can implement fallback logic)
  return gateways[0];
}

// Generate sample IPFS hash for demo purposes
export function generateSampleIPFSHash(): string {
  // This is just for demo - in production you'd upload actual content
  return 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
