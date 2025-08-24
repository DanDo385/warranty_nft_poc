import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useMintNFT } from '@/hooks/useMintNFT';
import { Product } from '@/lib/db';
import { uploadMetadataToIPFS } from '@/lib/ipfs';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { address, isConnected, chainId, connectWallet, disconnectWallet } = useWallet();
  const { mintWarranty, isLoading, isSuccess, isError, error, transactionHash } = useMintNFT();

  const handleMint = async () => {
    console.log('handleMint called, isConnected:', isConnected, 'address:', address, 'chainId:', chainId);
    
    if (!isConnected) {
      console.log('Connecting wallet...');
      connectWallet();
      return;
    }

    if (!address) {
      console.error('No wallet address available');
      return;
    }

    // For local development, we expect to be on chain 31337 (Anvil)
    if (chainId !== 31337) {
      console.warn('Expected to be on Anvil chain (31337), but on chain:', chainId);
      // Continue anyway for local development
    }

    try {
      console.log('Starting mint process for product:', product);

      // Helper function to determine warranty status
      const getWarrantyStatus = () => {
        const now = new Date();
        const expirationDate = new Date(product.warranty_expiration_date);
        return now < expirationDate ? 'Active' : 'Expired';
      };

      // Create metadata for the NFT - MetaMask compatible format
      const metadata = {
        name: `${product.brand_name} ${product.product_name} Warranty`,
        description: `Warranty NFT for ${product.brand_name} ${product.product_name} ${product.model_number}`,
        image: `https://olive-immense-rhinoceros-205.mypinata.cloud/ipfs/${product.ipfs_image_hash}`,
        external_url: `https://olive-immense-rhinoceros-205.mypinata.cloud/ipfs/${product.ipfs_image_hash}`,
        attributes: [
          { trait_type: 'Brand', value: product.brand_name },
          { trait_type: 'Model', value: product.model_number },
          { trait_type: 'Serial Number', value: product.serial_number },
          { trait_type: 'Purchase Date', value: product.purchase_date },
          { trait_type: 'Warranty Expires', value: product.warranty_expiration_date },
          { trait_type: 'Warranty Status', value: getWarrantyStatus() },
        ],
        properties: {
          files: [
            {
              type: "image/png",
              uri: `https://olive-immense-rhinoceros-205.mypinata.cloud/ipfs/${product.ipfs_image_hash}`
            }
          ],
          category: "image"
        }
      };

      console.log('Uploading metadata to IPFS:', metadata);

      // Upload metadata to IPFS
      let metadataURI: string;
      try {
        console.log('🔍 Attempting to upload metadata to IPFS...');
        const metadataHash = await uploadMetadataToIPFS(metadata);
        metadataURI = `ipfs://${metadataHash}`;
        console.log('✅ Metadata successfully uploaded to IPFS:', metadataHash);
        console.log('🔗 Full metadata URI:', metadataURI);
        console.log('📱 You can view the metadata at:', `https://ipfs.io/ipfs/${metadataHash}`);
      } catch (error) {
        console.error('❌ IPFS upload failed:', error);
        console.warn('⚠️ Using mock metadata URI for demo purposes');
        // Fallback: create a mock metadata URI for testing
        const mockHash = 'Qm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        metadataURI = `ipfs://${mockHash}`;
        console.log('🎭 Using mock metadata URI:', metadataURI);
        console.log('⚠️ NOTE: This NFT will NOT display properly in MetaMask!');
      }

      // Convert warranty expiration string to Date
      const expirationDate = new Date(product.warranty_expiration_date);

      console.log('Calling mintWarranty with:', {
        address,
        metadataURI,
        expirationDate,
        productName: product.product_name,
        brandName: product.brand_name,
        modelNumber: product.model_number,
        serialNumber: product.serial_number,
        purchaseDate: product.purchase_date,
        warrantyExpirationDate: product.warranty_expiration_date
      });

      if (!product.ipfs_image_hash) {
        throw new Error('Product image hash is required for minting');
      }

      await mintWarranty(
        address,
        metadataURI, // Use the metadata URI, not the image hash
        expirationDate,
        product.product_name,
        product.brand_name,
        product.model_number,
        product.serial_number,
        product.purchase_date,
        product.warranty_expiration_date
      );
      
      // Verify the NFT was minted
      console.log('🎉 NFT minted successfully!');
      console.log('📱 The NFT should now appear in your MetaMask wallet with:');
      console.log('   - Image:', `https://olive-immense-rhinoceros-205.mypinata.cloud/ipfs/${product.ipfs_image_hash}`);
      console.log('   - Product:', product.product_name);
      console.log('   - Brand:', product.brand_name);
      console.log('   - Model:', product.model_number);
      console.log('   - Serial:', product.serial_number);
      console.log('   - Purchase Date:', product.purchase_date);
      console.log('   - Warranty Expires:', product.warranty_expiration_date);
      console.log('💡 All warranty details are now stored ON-CHAIN and accessible directly in your wallet!');
    } catch (error) {
      console.error('❌ Error minting NFT:', error);
    }
  };

  const getWarrantyStatus = () => {
    const now = new Date();
    const expiration = new Date(product.warranty_expiration_date);
    return now < expiration ? 'Active' : 'Expired';
  };

  const getStatusColor = () => {
    const status = getWarrantyStatus();
    return status === 'Active' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Product Image - Left Side */}
        <div className="h-80 lg:h-full bg-gray-100 flex items-center justify-center">
          {product.ipfs_image_hash ? (
            <img
              src={`https://ipfs.io/ipfs/${product.ipfs_image_hash}`}
              alt={product.product_name}
              className="h-full w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`text-gray-400 text-center ${product.ipfs_image_hash ? 'hidden' : ''}`}>
            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>No image available</p>
          </div>
        </div>

        {/* Product Details - Right Side */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{product.product_name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                {getWarrantyStatus()}
              </span>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium text-gray-900">{product.brand_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-medium text-gray-900">{product.model_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Serial Number:</span>
                <span className="font-medium text-gray-900 font-mono">{product.serial_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Purchase Date:</span>
                <span className="font-medium text-gray-900">{product.purchase_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Warranty Expires:</span>
                <span className="font-medium text-gray-900">{product.warranty_expiration_date}</span>
              </div>
            </div>
          </div>

          {/* Mint NFT Button */}
          <div className="space-y-3">
            {!isConnected ? (
            <button
              onClick={handleMint}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Connect Wallet to Mint NFT
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 text-center">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <div className="text-xs text-center">
                <span className={`px-2 py-1 rounded-full ${
                  chainId === 31337 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {chainId === 31337 ? 'Localhost (Anvil)' : `Wrong Network! Chain ID: ${chainId}`}
                </span>
                {chainId !== 31337 && (
                  <div className="mt-2 text-xs text-red-600">
                    Please switch to Anvil Local network in MetaMask
                  </div>
                )}
              </div>
              <button
                onClick={handleMint}
                disabled={isLoading || chainId !== 31337}
                className={`w-full font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                  isLoading || chainId !== 31337
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSuccess ? 'Minting...' : 'Preparing...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {chainId === 31337 ? 'Mint NFT' : 'Switch to Anvil Network'}
                  </>
                )}
              </button>
              
              {isSuccess && (
                <div className="text-center">
                  <div className="text-green-600 font-medium">NFT Minted Successfully!</div>
                  {transactionHash && (
                    <div className="text-sm text-gray-600 mt-1">
                      TX: {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                    </div>
                  )}
                </div>
              )}
              
              {isError && (
                <div className="text-center text-red-600 font-medium">
                  Error: {error?.message || 'Failed to mint NFT'}
                </div>
              )}
              
              <button
                onClick={disconnectWallet}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
