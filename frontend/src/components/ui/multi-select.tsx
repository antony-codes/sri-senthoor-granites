import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from './badge';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search...',
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase().trim())
  );

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((o) => o.value));
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full font-sans', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full min-h-[40px] px-3.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:border-black text-xs font-semibold text-gray-900 flex items-center justify-between gap-2 transition-colors cursor-pointer focus:outline-none focus:border-black"
      >
        <div className="flex flex-wrap items-center gap-1 max-w-[85%] truncate">
          {selected.length === 0 ? (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          ) : selected.length <= 2 ? (
            selected.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <Badge key={val} variant="secondary" className="text-[10px] lowercase tracking-normal font-semibold">
                  {opt?.label || val}
                  <X
                    className="w-3 h-3 ml-1 text-gray-500 hover:text-black cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(val);
                    }}
                  />
                </Badge>
              );
            })
          ) : (
            <Badge variant="default" className="text-[10px]">
              {selected.length} Selected
            </Badge>
          )}
        </div>

        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform shrink-0', open && 'rotate-180')} />
      </button>

      {/* Popover Menu */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[220px] bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 font-sans space-y-2 animate-in fade-in-50 zoom-in-95">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-black text-gray-900"
            />
          </div>

          {/* Action Bar (Select All / Clear) */}
          <div className="flex items-center justify-between px-1.5 pt-1 text-[10px] font-bold text-gray-500 border-b border-gray-100 pb-1.5">
            <button
              type="button"
              onClick={handleSelectAll}
              className="hover:text-black cursor-pointer uppercase tracking-wider"
            >
              {selected.length === options.length ? 'Clear All' : 'Select All'}
            </button>
            <span>{selected.length} of {options.length}</span>
          </div>

          {/* Option List with Checkboxes */}
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-gray-400">No results found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left',
                      isSelected ? 'bg-gray-100 font-bold text-black' : 'hover:bg-gray-50 text-gray-700 font-medium'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                          isSelected ? 'bg-black border-black text-white' : 'border-gray-300 bg-white'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{opt.label}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
