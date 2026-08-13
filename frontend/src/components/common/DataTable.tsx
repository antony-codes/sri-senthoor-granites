import React from 'react';
import { Search, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export interface DataTableColumn<T> {
  header: string | React.ReactNode;
  cell: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  keyExtractor: (item: T, index: number) => string;

  // Loading & Empty state
  loading?: boolean;
  emptyMessage?: string;

  // Search
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;

  // Custom Filter & Action slots
  filters?: React.ReactNode;
  actions?: React.ReactNode;

  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataTable<T>({
  title,
  subtitle,
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'No matching records found.',
  search,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters,
  actions,
  currentPage = 1,
  totalPages = 1,
  totalCount,
  limit = 10,
  onPageChange,
  onLimitChange,
}: DataTableProps<T>) {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = totalCount !== undefined ? Math.min(currentPage * limit, totalCount) : data.length;

  return (
    <div className="space-y-4 font-sans">
      {/* Title & Top Action Header (if provided) */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
          <div>
            {title && <h2 className="font-sans text-2xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        </div>
      )}

      {/* Control Bar: Search + Filters + Additional Actions */}
      <Card className="p-4 rounded-2xl border-gray-200 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input Box */}
          {onSearchChange !== undefined && (
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={search || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-8"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Filters & Header Actions Slot */}
          <div className="flex flex-wrap items-center gap-3">
            {filters}
            {!title && actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      </Card>

      {/* Main Table Grid */}
      <Card className="rounded-2xl border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3 text-gray-500">
            <Loader2 className="w-7 h-7 animate-spin text-black" />
            <span className="text-xs font-semibold uppercase tracking-wider">Loading data records...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500 font-medium">{emptyMessage}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, idx) => (
                  <TableHead key={idx} className={col.headerClassName}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={keyExtractor(item, index)}>
                  {columns.map((col, cIdx) => (
                    <TableCell key={cIdx} className={col.className}>
                      {col.cell(item, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Integrated Pagination Footer */}
        {onPageChange && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 font-sans">
            <div className="flex items-center gap-3">
              {totalCount !== undefined && (
                <span>
                  Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
                  <span className="font-bold text-gray-900">{endItem}</span> of{' '}
                  <span className="font-bold text-gray-900">{totalCount}</span> entries
                </span>
              )}

              {onLimitChange && (
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Show</span>
                  <Select
                    value={String(limit)}
                    onValueChange={(val) => onLimitChange(Number(val))}
                    className="w-20"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </Select>
                </div>
              )}
            </div>

            {/* Page Buttons Navigation */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="h-8 px-2.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Button>

              <Badge variant="secondary" className="px-3 py-1 text-xs">
                Page {currentPage} of {totalPages}
              </Badge>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="h-8 px-2.5"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
