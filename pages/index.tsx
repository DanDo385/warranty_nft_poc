import { useState } from 'react';
import { Search, Package, Shield, Calendar, Hash } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import SearchForm from '@/components/SearchForm';
import { Product } from '@/lib/db';

export default function Home() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (serialNumber: string) => {
    setLoading(true);
    setError(null);
    setProduct(null);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serialNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to search product');
      }

      setProduct(data.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-silver-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">WarrantyNFT</h1>
            </div>
            <div className="text-silver-400 text-sm">
              Secure • Immutable • Decentralized
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Verify Your Warranty
          </h2>
          <p className="text-xl text-silver-300 max-w-3xl mx-auto">
            Enter your product serial number to verify warranty status and mint your 
            warranty NFT on the blockchain. Secure, transparent, and forever accessible.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="text-silver-400 mt-2">Searching for product...</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 text-red-300">
              <p className="text-center">{error}</p>
            </div>
          </div>
        )}

        {product && (
          <div className="max-w-4xl mx-auto">
            <ProductCard product={product} />
          </div>
        )}

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Product Verification</h3>
            <p className="text-silver-400">
              Instantly verify product details and warranty information
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">NFT Warranty</h3>
            <p className="text-silver-400">
              Mint your warranty as an immutable NFT on the blockchain
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Expiration Tracking</h3>
            <p className="text-silver-400">
              Always know when your warranty expires
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-silver-700 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-silver-400">
            <p>&copy; 2025 WarrantyNFT. Built with Next.js and Solidity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
