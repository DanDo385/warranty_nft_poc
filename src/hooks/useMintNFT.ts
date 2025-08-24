import { useState } from 'react';
import { useContractWrite, useWaitForTransaction, usePublicClient } from 'wagmi';
import { WarrantyNFTFactoryABI, CONTRACT_ADDRESSES, ACME_TOASTERS_KEY } from '@/lib/contracts';
import { keccak256, toBytes } from 'viem';

export const useMintNFT = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const publicClient = usePublicClient();

  // Execute the mint transaction
  const { data, write, isLoading: isWriting, error: writeError } = useContractWrite({
    address: CONTRACT_ADDRESSES.factory as `0x${string}`, // Use factory address, not collection
    abi: WarrantyNFTFactoryABI,
    functionName: 'mintWarranty',
    chainId: 31337, // Anvil local chain
  });

  // Wait for transaction confirmation - only when there's a hash
  const { isLoading: isConfirming, isSuccess, isError, error } = useWaitForTransaction({
    hash: data?.hash,
    enabled: !!data?.hash, // Only enable when there's a hash
  });

  const mintWarranty = async (
    to: string,
    metadataURI: string,
    expirationDate: Date,
    productName: string,
    brandName: string,
    modelNumber: string,
    serialNumber: string,
    purchaseDate: string,
    warrantyExpirationDate: string
  ) => {
    try {
      setIsConnecting(true);
      
      // Debug: Check if contract exists at the address
      if (publicClient) {
        try {
          // Check factory address (this is what we're calling)
          const factoryCode = await publicClient.getBytecode({
            address: CONTRACT_ADDRESSES.factory as `0x${string}`,
          });
          console.log('Factory contract code:', factoryCode);
          console.log('Factory exists:', factoryCode !== undefined);
          
          if (factoryCode === undefined) {
            console.error('❌ Factory contract not found!');
            console.error('This means either:');
            console.error('1. The factory was never deployed');
            console.error('2. Anvil restarted and the address is now empty');
            console.error('3. We have the wrong factory address');
            return;
          }

          // Check if the collection exists
          try {
            const collectionAddress = await publicClient.readContract({
              address: CONTRACT_ADDRESSES.factory as `0x${string}`,
              abi: WarrantyNFTFactoryABI,
              functionName: 'collections',
              args: [ACME_TOASTERS_KEY],
            });
            
            console.log('Collection address from factory:', collectionAddress);
            
            if (collectionAddress === '0x0000000000000000000000000000000000000000') {
              console.error('❌ Collection does not exist yet!');
              console.error('The collection for ACME::T1000 needs to be created first.');
              console.error('This requires the factory owner to call createCollection().');
              return;
            }
            
            console.log('✅ Collection exists at:', collectionAddress);
          } catch (collectionError) {
            console.error('Error checking collection:', collectionError);
            return;
          }
        } catch (error) {
          console.error('Error checking contract code:', error);
        }
      }
      
      // Convert expiration date to timestamp
      const expirationTimestamp = Math.floor(expirationDate.getTime() / 1000);
      
      // Create a proper 32-byte hash from the serial number
      const serialHash = keccak256(toBytes(serialNumber));
      
              console.log('Minting warranty NFT with params:', {
          collectionKey: ACME_TOASTERS_KEY,
          to,
          metadataURI,
          expirationTimestamp,
          productName,
          brandName,
          modelNumber,
          serialNumber,
          purchaseDate,
          warrantyExpirationDate,
          serialHash
        });
        
        console.log('Contract details:', {
          factoryAddress: CONTRACT_ADDRESSES.factory,
          collectionAddress: CONTRACT_ADDRESSES.collection,
          abi: WarrantyNFTFactoryABI
        });
        
        // Call the mint function
        if (write) {
          write({
            args: [
              ACME_TOASTERS_KEY, // Collection key
              to as `0x${string}`, // Recipient address
              metadataURI, // IPFS metadata URI
              BigInt(expirationTimestamp), // Expiration timestamp
              productName, // Product name
              brandName, // Brand name
              modelNumber, // Model number
              serialNumber, // Serial number
              purchaseDate, // Purchase date
              warrantyExpirationDate, // Warranty expiration date
              serialHash, // Serial number hash (now properly 32 bytes)
            ],
          });
        } else {
          console.error('Write function not available');
        }
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    mintWarranty,
    isLoading: isWriting || isConfirming || isConnecting,
    isSuccess,
    isError,
    error: writeError || error,
    transactionHash: data?.hash,
  };
};
