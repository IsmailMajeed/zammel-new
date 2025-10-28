'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';

export default function EmptyCart() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
                        <p className="text-muted-foreground mb-8">
                            Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            <span>Start Shopping</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <div>
                            <Link
                                href="/"
                                className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Continue Shopping</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
