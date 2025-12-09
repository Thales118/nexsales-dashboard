import React, { memo, useCallback } from 'react';
import { Product } from '@/store/slices/inventorySlice';
import { Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InventoryRowProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const statusStyles = {
  in_stock: 'bg-success/20 text-success border-success/30',
  low_stock: 'bg-warning/20 text-warning border-warning/30',
  out_of_stock: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusLabels = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

const InventoryRow: React.FC<InventoryRowProps> = memo(({ product, onEdit, onDelete, isAdmin = true }) => {
  const handleEdit = useCallback(() => {
    onEdit(product.id);
  }, [product.id, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(product.id);
  }, [product.id, onDelete]);

  return (
    <tr className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
      <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{product.sku}</td>
      <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{product.category}</td>
      <td className="px-4 py-3 text-sm font-mono text-right">${product.price.toFixed(2)}</td>
      <td className="px-4 py-3 text-sm font-mono text-right">{product.quantity.toLocaleString()}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            'inline-flex px-2 py-1 rounded-full text-xs font-medium border',
            statusStyles[product.status]
          )}
        >
          {statusLabels[product.status]}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{product.supplier}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{product.location}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={handleEdit} className="h-8 w-8">
            <Edit2 className="w-4 h-4" />
          </Button>
          {isAdmin && (
            <Button size="icon" variant="ghost" onClick={handleDelete} className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
});

InventoryRow.displayName = 'InventoryRow';

export default InventoryRow;
