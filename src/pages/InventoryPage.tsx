import React, { useMemo, useCallback, useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectFilteredProducts,
  selectFilters,
  selectSorting,
  setFilter,
  setSorting,
  updateProduct,
  deleteProduct,
  Product,
} from '@/store/slices/inventorySlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Modal from '@/components/Modal';
import ProductEditor from '@/components/ProductEditor';
import InventoryRow from '@/components/InventoryRow';
import { Search, Filter, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Automotive', 'Books', 'Toys', 'Food & Beverage'];
const statuses = ['all', 'in_stock', 'low_stock', 'out_of_stock'];

const InventoryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const filters = useAppSelector(selectFilters);
  const sorting = useAppSelector(selectSorting);
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const handleSort = useCallback(
    (field: keyof Product) => {
      dispatch(
        setSorting({
          field,
          direction: sorting.field === field && sorting.direction === 'asc' ? 'desc' : 'asc',
        })
      );
    },
    [dispatch, sorting]
  );

  const handleEdit = useCallback(
    (id: string) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        setEditingProduct(product);
        setIsEditorOpen(true);
      }
    },
    [products]
  );

  const handleDelete = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteConfirmId) {
      dispatch(deleteProduct(deleteConfirmId));
      dispatch(
        addNotification({
          type: 'success',
          title: 'Product Deleted',
          message: 'The product has been removed from inventory.',
        })
      );
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, dispatch]);

  const handleSaveProduct = useCallback(
    (data: any) => {
      if (editingProduct) {
        const quantity = data.quantity;
        const status: Product['status'] =
          quantity === 0 ? 'out_of_stock' : quantity < 50 ? 'low_stock' : 'in_stock';

        dispatch(
          updateProduct({
            ...editingProduct,
            ...data,
            status,
          })
        );
        dispatch(
          addNotification({
            type: 'success',
            title: 'Product Updated',
            message: `${data.name} has been updated successfully.`,
          })
        );
      }
      setIsEditorOpen(false);
      setEditingProduct(null);
    },
    [editingProduct, dispatch]
  );

  const SortHeader = ({ field, label, width }: { field: keyof Product; label: string; width?: string }) => {
    const isActive = sorting.field === field;
    return (
      <th
        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border cursor-pointer hover:bg-secondary/80 transition-colors"
        style={{ width }}
        onClick={() => handleSort(field)}
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <span className="flex flex-col">
            <ChevronUp
              className={cn(
                'w-3 h-3 -mb-1',
                isActive && sorting.direction === 'asc' ? 'text-primary' : 'text-muted-foreground/50'
              )}
            />
            <ChevronDown
              className={cn(
                'w-3 h-3',
                isActive && sorting.direction === 'desc' ? 'text-primary' : 'text-muted-foreground/50'
              )}
            />
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-xl border border-border">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products, SKU, supplier..."
            value={filters.search}
            onChange={(e) => dispatch(setFilter({ key: 'search', value: e.target.value }))}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.category}
          onValueChange={(value) => dispatch(setFilter({ key: 'category', value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => dispatch(setFilter({ key: 'status', value }))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'all'
                  ? 'All Status'
                  : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{products.length.toLocaleString()}</span> products
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50 sticky top-0 z-10">
              <tr>
                <SortHeader field="sku" label="SKU" width="120px" />
                <SortHeader field="name" label="Product Name" />
                <SortHeader field="category" label="Category" width="140px" />
                <SortHeader field="price" label="Price" width="100px" />
                <SortHeader field="quantity" label="Quantity" width="100px" />
                <SortHeader field="status" label="Status" width="120px" />
                <SortHeader field="supplier" label="Supplier" width="130px" />
                <SortHeader field="location" label="Location" width="160px" />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Virtualized Body */}
        <div ref={parentRef} className="h-[600px] overflow-auto scrollbar-thin">
          <table className="w-full">
            <tbody>
              <tr style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="relative block w-full">
                <td className="block w-full">
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const product = products[virtualRow.index];
                    return (
                      <div
                        key={product.id}
                        className="absolute left-0 w-full"
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <table className="w-full">
                          <tbody>
                            <InventoryRow
                              product={product}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              isAdmin={isAdmin}
                            />
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title="Edit Product" size="lg">
        {editingProduct && (
          <ProductEditor
            product={editingProduct}
            onSubmit={handleSaveProduct}
            onCancel={() => setIsEditorOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Delete" size="sm">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <p className="text-muted-foreground mb-6">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InventoryPage;
