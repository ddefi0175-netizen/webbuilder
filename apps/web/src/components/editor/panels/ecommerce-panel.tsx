'use client';

/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */

import { useState } from 'react';
import {
    ShoppingCart,
    Package,
    CreditCard,
    Truck,
    Tag,
    Plus,
    Settings,
    Edit,
    Trash2,
    Image,
    DollarSign,
    Percent,
    CheckCircle,
    AlertCircle,
    ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    stock: number;
    category: string;
    status: 'active' | 'draft';
}

const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Headphones',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        description: 'High-quality wireless headphones',
        stock: 50,
        category: 'Electronics',
        status: 'active'
    },
    {
        id: '2',
        name: 'Smart Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        description: 'Feature-rich smart watch',
        stock: 25,
        category: 'Electronics',
        status: 'active'
    },
    {
        id: '3',
        name: 'Laptop Stand',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
        description: 'Ergonomic laptop stand',
        stock: 100,
        category: 'Accessories',
        status: 'draft'
    }
];

const paymentProviders = [
    { id: 'stripe', name: 'Stripe', connected: true },
    { id: 'paypal', name: 'PayPal', connected: false },
    { id: 'square', name: 'Square', connected: false },
];

const shippingOptions = [
    { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7' },
    { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3' },
    { id: 'overnight', name: 'Overnight', price: 24.99, days: '1' },
];

export function EcommercePanel() {
    const [activeTab, setActiveTab] = useState<'products' | 'payments' | 'shipping' | 'settings'>('products');
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        stock: '',
        category: ''
    });

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.price) {
            const product: Product = {
                id: Date.now().toString(),
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                image: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop',
                description: newProduct.description,
                stock: parseInt(newProduct.stock) || 0,
                category: newProduct.category || 'General',
                status: 'draft'
            };
            setProducts([...products, product]);
            setNewProduct({ name: '', price: '', description: '', stock: '', category: '' });
            setShowAddProduct(false);
        }
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">E-Commerce</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Manage your online store
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {[
                    { id: 'products', label: 'Products', icon: Package },
                    { id: 'payments', label: 'Payments', icon: CreditCard },
                    { id: 'shipping', label: 'Shipping', icon: Truck },
                    { id: 'settings', label: 'Settings', icon: Settings },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            'flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1',
                            activeTab === tab.id
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tab.icon className="h-3 w-3" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTab === 'products' && (
                        <>
                            {!showAddProduct ? (
                                <>
                                    <Button
                                        className="w-full"
                                        onClick={() => setShowAddProduct(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Product
                                    </Button>

                                    <div className="space-y-2">
                                        {products.map((product) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-3 border rounded-lg"
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm truncate">
                                                            {product.name}
                                                        </span>
                                                        <span className={cn(
                                                            'px-1.5 py-0.5 rounded text-xs',
                                                            product.status === 'active'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        )}>
                                                            {product.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span>${product.price.toFixed(2)}</span>
                                                        <span>•</span>
                                                        <span>{product.stock} in stock</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {products.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No products yet</p>
                                            <p className="text-xs">Add your first product to get started</p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-sm font-medium">Add New Product</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowAddProduct(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-xs">Product Name</Label>
                                            <Input
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                                placeholder="Enter product name"
                                                className="text-sm mt-1"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">Price</Label>
                                                <div className="relative mt-1">
                                                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        value={newProduct.price}
                                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                        placeholder="0.00"
                                                        className="text-sm pl-8"
                                                        type="number"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Stock</Label>
                                                <Input
                                                    value={newProduct.stock}
                                                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                                    placeholder="0"
                                                    className="text-sm mt-1"
                                                    type="number"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-xs">Category</Label>
                                            <Input
                                                value={newProduct.category}
                                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                                placeholder="e.g., Electronics"
                                                className="text-sm mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-xs">Description</Label>
                                            <Textarea
                                                value={newProduct.description}
                                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                                placeholder="Product description..."
                                                className="text-sm mt-1 resize-none"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <Label className="text-xs">Product Image</Label>
                                            <div className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors">
                                                <Image className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                                                <p className="text-xs text-muted-foreground">Click to upload image</p>
                                            </div>
                                        </div>

                                        <Button className="w-full" onClick={handleAddProduct}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Product
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'payments' && (
                        <>
                            <Label className="text-xs">Payment Providers</Label>
                            <div className="space-y-2">
                                {paymentProviders.map((provider) => (
                                    <div
                                        key={provider.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <span className="font-medium text-sm">{provider.name}</span>
                                                {provider.connected && (
                                                    <span className="flex items-center gap-1 text-xs text-green-500">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Connected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant={provider.connected ? 'outline' : 'default'}
                                            size="sm"
                                        >
                                            {provider.connected ? 'Settings' : 'Connect'}
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <Label className="text-xs">Tax Settings</Label>
                                <div className="p-3 bg-muted rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm">Auto-calculate tax</span>
                                        <input type="checkbox" className="rounded" defaultChecked />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Automatically calculate and apply taxes based on customer location
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Discount Codes</Label>
                                <Button variant="outline" className="w-full">
                                    <Percent className="h-4 w-4 mr-2" />
                                    Manage Discount Codes
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'shipping' && (
                        <>
                            <Label className="text-xs">Shipping Options</Label>
                            <div className="space-y-2">
                                {shippingOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Truck className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <span className="font-medium text-sm">{option.name}</span>
                                                <span className="block text-xs text-muted-foreground">
                                                    {option.days} business days
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium text-sm">${option.price}</span>
                                            <Button variant="ghost" size="sm" className="ml-2">
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Shipping Option
                            </Button>

                            <div className="pt-4 border-t space-y-2">
                                <Label className="text-xs">Free Shipping Threshold</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="50.00"
                                        className="pl-9"
                                        defaultValue="50.00"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Orders above this amount get free standard shipping
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === 'settings' && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">Store Currency</Label>
                                <select className="w-full border rounded-lg px-3 py-2 text-sm">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Inventory Management</Label>
                                <div className="p-3 bg-muted rounded-lg space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Track inventory</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Low stock alerts</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-sm">Allow backorders</span>
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Order Notifications</Label>
                                <Input
                                    placeholder="your@email.com"
                                    className="text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Receive email notifications for new orders
                                </p>
                            </div>

                            <div className="pt-4 border-t space-y-2">
                                <Label className="text-xs">Store Policies</Label>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Edit Return Policy
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Edit Privacy Policy
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Edit Terms of Service
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
