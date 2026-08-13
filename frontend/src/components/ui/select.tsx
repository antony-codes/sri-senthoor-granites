import * as React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  // Fallback HTML Select compatibility props
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options = [],
  placeholder = 'Select option...',
  className,
  disabled = false,
  children,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // If children are native <option> elements, extract option list automatically
  const parsedOptions = React.useMemo(() => {
    if (options.length > 0) return options;
    const opts: SelectOption[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === 'option') {
        const props = child.props as any;
        opts.push({
          value: String(props.value ?? ''),
          label: String(props.children ?? props.value ?? ''),
        });
      }
    });
    return opts;
  }, [options, children]);

  const selectedOption = parsedOptions.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    if (onValueChange) {
      onValueChange(val);
    }
    if (onChange) {
      // Simulate HTML Change Event for react-hook-form / standard handlers
      const event = {
        target: { value: val },
        currentTarget: { value: val },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full font-sans', className)}>
      {/* Hidden Native Select for Form Compatibility */}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        tabIndex={-1}
        className="sr-only"
      >
        {parsedOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Custom-Styled Select Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-full rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all cursor-pointer items-center justify-between gap-2 shadow-2xs hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
          open && 'border-black bg-white ring-1 ring-black'
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-gray-400 font-normal')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform shrink-0', open && 'rotate-180 text-black')} />
      </button>

      {/* Animated Popover Dropdown Menu */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[180px] bg-white rounded-2xl border border-gray-200 shadow-2xl p-1.5 font-sans space-y-0.5 animate-in fade-in-50 zoom-in-95">
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {parsedOptions.length === 0 ? (
              <div className="py-2.5 px-3 text-center text-xs text-gray-400">No options available</div>
            ) : (
              parsedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer text-left',
                      isSelected
                        ? 'bg-black text-white font-bold'
                        : 'hover:bg-gray-100 text-gray-800 font-medium'
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0 ml-2" />}
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
