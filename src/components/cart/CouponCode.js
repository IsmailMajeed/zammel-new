'use client';

import { useState } from 'react';
import { Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon, removeCoupon } from '@/redux/slices/Cart';

export default function CouponCode() {
    const dispatch = useDispatch();
    const { couponCode, discount } = useSelector(state => state.cart);
    const [couponInput, setCouponInput] = useState('');

    const handleApplyCoupon = () => {
        if (couponInput.trim()) {
            // Mock coupon validation
            const validCoupons = {
                'SAVE10': 10,
                'WELCOME20': 20,
                'FREESHIP': 0
            };

            const couponDiscount = validCoupons[couponInput.toUpperCase()];
            if (couponDiscount !== undefined) {
                dispatch(applyCoupon({
                    code: couponInput.toUpperCase(),
                    discount: couponDiscount
                }));
                setCouponInput('');
            } else {
                alert('Invalid coupon code');
            }
        }
    };

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
    };

    return (
        <div className="mb-6">
            <h3 className="font-medium text-foreground mb-3">Coupon Code</h3>
            {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-success" />
                        <span className="text-sm font-medium text-success">{couponCode}</span>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm"
                    />
                    <button
                        onClick={handleApplyCoupon}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}
