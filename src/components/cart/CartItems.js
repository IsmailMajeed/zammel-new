'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '@/redux/slices/Cart';
import { toast } from 'sonner';

export default function CartItems({ items }) {
    const dispatch = useDispatch();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            minimumFractionDigits: 0,
        }).format(Math.round(price));
    };

    const handleQuantityChange = (item, newQuantity) => {
        if (newQuantity <= 0) {
            dispatch(removeFromCart(item.id));
        } else {
            const maxQuantity = item.maxQuantity || Infinity;
            if (newQuantity > maxQuantity) {
                toast.error('Stock Limit', {
                    description: `Only ${maxQuantity} item(s) available. Stock has been reduced.`
                });
                dispatch(updateQuantity({
                    id: item.id,
                    quantity: maxQuantity,
                    maxQuantity: maxQuantity
                }));
            } else {
                dispatch(updateQuantity({
                    id: item.id,
                    quantity: newQuantity,
                    maxQuantity: maxQuantity
                }));
            }
        }
    };

    const handleRemoveItem = (id) => {
        dispatch(removeFromCart(id));
    };

    return (
        <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6"
                >
                    <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground line-clamp-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {item.brand}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-bold text-foreground">
                                            {formatPrice(item.price)}
                                        </span>
                                        {item.originalPrice > item.price && (
                                            <span className="text-sm text-muted-foreground line-through">
                                                {formatPrice(item.originalPrice)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Stock Info */}
                            {item.maxQuantity !== undefined && (
                                <p className={`text-xs mt-1 ${item.quantity >= item.maxQuantity ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                    {item.quantity >= item.maxQuantity
                                        ? `Only ${item.maxQuantity} available (Stock reduced)`
                                        : `${item.maxQuantity} available`}
                                </p>
                            )}

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center border border-border rounded-lg">
                                    <button
                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                        className="p-2 hover:bg-muted transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium text-foreground min-w-[3rem] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                        disabled={item.maxQuantity !== undefined && item.quantity >= item.maxQuantity}
                                        className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="text-right">
                                    <div className="font-semibold text-foreground">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                    {item.quantity > 1 && (
                                        <div className="text-sm text-muted-foreground">
                                            {formatPrice(item.price)} each
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
