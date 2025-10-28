'use client';

import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '@/redux/slices/Cart';
import CouponCode from './CouponCode';

export default function OrderSummary() {
    const dispatch = useDispatch();
    const { items, total, itemCount, couponCode, discount } = useSelector(state => state.cart);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const finalTotal = subtotal + shipping + tax - discount;

    return (
        <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <CouponCode />

                {/* Order Details */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-foreground">
                            {shipping === 0 ? 'Free' : formatPrice(shipping)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="text-foreground">{formatPrice(tax)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-success">
                            <span>Discount ({couponCode})</span>
                            <span>-{formatPrice(discount)}</span>
                        </div>
                    )}
                    <div className="border-t border-border pt-3">
                        <div className="flex justify-between font-bold text-lg">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">{formatPrice(finalTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 50 && (
                    <div className="mb-6 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary">
                                Add {formatPrice(50 - subtotal)} more for free shipping!
                            </span>
                        </div>
                    </div>
                )}

                {/* Checkout Button */}
                <Link
                    href="/checkout"
                    className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center space-x-2 mb-4"
                >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                </Link>

                {/* Clear Cart Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-destructive hover:text-destructive/80 transition-colors flex items-center space-x-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Cart</span>
                    </button>
                </div>

                {/* Payment Methods */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">We accept</p>
                    <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">All major cards</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
