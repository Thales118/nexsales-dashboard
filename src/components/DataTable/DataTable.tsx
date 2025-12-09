import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// Context Types
interface DataTableContextType<T> {
  data: T[];
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const DataTableContext = createContext<DataTableContextType<any> | null>(null);

function useDataTableContext() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('DataTable compound components must be used within DataTable');
  }
  return context;
}

// Main DataTable Component
interface DataTableProps<T> {
  data: T[];
  sortField?: string | null;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  children: ReactNode;
  className?: string;
}

function DataTable<T>({
  data,
  sortField = null,
  sortDirection = 'asc',
  onSort = () => {},
  children,
  className,
}: DataTableProps<T>) {
  const contextValue = useMemo(
    () => ({ data, sortField, sortDirection, onSort }),
    [data, sortField, sortDirection, onSort]
  );

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className={cn('w-full overflow-auto scrollbar-thin', className)}>
        <table className="w-full border-collapse">
          {children}
        </table>
      </div>
    </DataTableContext.Provider>
  );
}

// Header Component
interface HeaderProps {
  children: ReactNode;
  className?: string;
}

function Header({ children, className }: HeaderProps) {
  return (
    <thead className={cn('bg-secondary/50 sticky top-0 z-10', className)}>
      <tr>{children}</tr>
    </thead>
  );
}

// Column Component
interface ColumnProps {
  header: string;
  field: string;
  sortable?: boolean;
  width?: string;
  className?: string;
}

function Column({ header, field, sortable = true, width, className }: ColumnProps) {
  const { sortField, sortDirection, onSort } = useDataTableContext();
  const isActive = sortField === field;

  const handleSort = useCallback(() => {
    if (sortable) {
      onSort(field);
    }
  }, [sortable, field, onSort]);

  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border',
        sortable && 'cursor-pointer hover:bg-secondary/80 transition-colors',
        className
      )}
      style={{ width }}
      onClick={handleSort}
    >
      <div className="flex items-center gap-2">
        <span>{header}</span>
        {sortable && (
          <span className="flex flex-col">
            <ChevronUp
              className={cn(
                'w-3 h-3 -mb-1',
                isActive && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/50'
              )}
            />
            <ChevronDown
              className={cn(
                'w-3 h-3',
                isActive && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/50'
              )}
            />
          </span>
        )}
      </div>
    </th>
  );
}

// Body Component
interface BodyProps {
  children: ReactNode;
  className?: string;
}

function Body({ children, className }: BodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

// Row Component
interface RowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function Row({ children, className, onClick }: RowProps) {
  return (
    <tr
      className={cn(
        'border-b border-border/50 hover:bg-secondary/30 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

// Cell Component
interface CellProps {
  children: ReactNode;
  className?: string;
}

function Cell({ children, className }: CellProps) {
  return (
    <td className={cn('px-4 py-3 text-sm', className)}>
      {children}
    </td>
  );
}

// Attach compound components
DataTable.Header = Header;
DataTable.Column = Column;
DataTable.Body = Body;
DataTable.Row = Row;
DataTable.Cell = Cell;

export default DataTable;
