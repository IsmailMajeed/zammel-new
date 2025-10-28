'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Home,
    ArrowLeft,
    Search,
    ShoppingBag,
    Heart,
    User,
    Menu,
    X
} from 'lucide-react';
import { BRAND } from '@/utils/brandConstants';

export default function NotFound() {
    const [timeLeft, setTimeLeft] = useState(10);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const quickLinks = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Products', href: '/products', icon: ShoppingBag },
        { name: 'Wishlist', href: '/wishlist', icon: Heart },
        { name: 'Login', href: '/login', icon: User },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
            {/* Header */}
            <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">{BRAND.name}</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                Home
                            </Link>
                            <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                                Products
                            </Link>
                            <Link href="/wishlist" className="text-muted-foreground hover:text-primary transition-colors">
                                Wishlist
                            </Link>
                            <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                                Login
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4"
                        >
                            <div className="flex flex-col space-y-2">
                                <Link
                                    href="/"
                                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Wishlist
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </div>
                        </motion.nav>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    {/* 404 Animation */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <div className="relative">
                            {/* Large 404 Text */}
                            <h1 className="text-9xl md:text-[12rem] font-bold text-primary/20 select-none">
                                404
                            </h1>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 5, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute top-8 right-8 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
                            >
                                <Search className="w-8 h-8 text-primary" />
                            </motion.div>

                            <motion.div
                                animate={{
                                    y: [0, 15, 0],
                                    rotate: [0, -5, 0]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                                className="absolute bottom-8 left-8 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
                            >
                                <ShoppingBag className="w-6 h-6 text-primary" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Oops! Page Not Found
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            The page you&apos;re looking for seems to have wandered off into the digital void.
                            Don&apos;t worry, even the best explorers sometimes take a wrong turn!
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Redirecting to home page in <span className="font-semibold text-primary">{timeLeft}</span> seconds...
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Go Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center px-8 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Popular Pages
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {quickLinks.map((link, index) => {
                                const Icon = link.icon;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-foreground">
                                                {link.name}
                                            </span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Search Suggestion */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        className="mt-8"
                    >
                        <p className="text-sm text-muted-foreground mb-4">
                            Looking for something specific? Try searching our products:
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Browse Products
                        </Link>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">{BRAND.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © 2024 {BRAND.name}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
