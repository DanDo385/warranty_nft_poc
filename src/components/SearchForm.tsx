import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFormProps {
  onSearch: (serialNumber: string) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [serialNumber, setSerialNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serialNumber.trim() && !loading) {
      onSearch(serialNumber.trim());
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="serialNumber" className="block text-sm font-medium text-silver-300 mb-2">
            Product Serial Number
          </label>
          <div className="relative">
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="Enter serial number (e.g., 123456789)"
              className="input-field pr-12"
              disabled={loading}
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="w-5 h-5 text-silver-400" />
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading || !serialNumber.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search Product'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-silver-400">
          Try searching for: <span className="text-primary-400 font-mono">123456789</span>
        </p>
      </div>
    </div>
  );
}
