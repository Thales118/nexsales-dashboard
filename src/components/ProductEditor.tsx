import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/store/slices/inventorySlice';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  supplier: z.string().min(2, 'Supplier is required'),
  location: z.string().min(2, 'Location is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductEditorProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Automotive', 'Books', 'Toys', 'Food & Beverage'];
const suppliers = ['TechCorp', 'GlobalSupply', 'FastShip', 'QualityFirst', 'BulkMart', 'PremiumGoods'];
const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Distribution Center 1', 'Distribution Center 2'];

const ProductEditor: React.FC<ProductEditorProps> = ({ product, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          supplier: product.supplier,
          location: product.location,
        }
      : {
          name: '',
          sku: '',
          category: '',
          price: 0,
          quantity: 0,
          supplier: '',
          location: '',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" {...register('name')} placeholder="Enter product name" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} placeholder="Enter SKU" />
          {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select onValueChange={(value) => setValue('category', value)} defaultValue={product?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Select onValueChange={(value) => setValue('supplier', value)} defaultValue={product?.supplier}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((sup) => (
                <SelectItem key={sup} value={sup}>
                  {sup}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.supplier && <p className="text-xs text-destructive">{errors.supplier.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select onValueChange={(value) => setValue('location', value)} defaultValue={product?.location}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductEditor;
