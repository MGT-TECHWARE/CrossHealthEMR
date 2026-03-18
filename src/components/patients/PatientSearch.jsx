import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Input from '@/components/ui/Input';

function useDebounce(callback, delay) {
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

const filterOptions = [
  { value: '', label: 'All Patients' },
  { value: 'recent', label: 'Recent Visits' },
  { value: 'upcoming', label: 'Upcoming Appointments' },
  { value: 'inactive', label: 'Inactive' },
];

export default function PatientSearch({ onSearch, onFilter }) {
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  const debouncedSearch = useDebounce((text) => {
    onSearch?.(text);
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setActiveFilter(value);
    onFilter?.(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search patients by name..."
          className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {onFilter && (
        <div className="relative shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={activeFilter}
            onChange={handleFilterChange}
            className="appearance-none pl-9 pr-8 py-2 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
