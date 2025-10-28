'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import store, { persistor } from '@/redux/store';
import Cart from '@/components/Cart';
import Wishlist from '@/components/Wishlist';
import { BRAND } from '@/utils/brandConstants';

export function Providers({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                {children}
                <Cart />
                <Wishlist />
                <Toaster position="top-right" />
            </PersistGate>
        </Provider>
    );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6">
                {/* Slick Pulse Spinner */}
                <div className="relative flex justify-center items-center">
                    <span className="absolute w-12 h-12 rounded-full border-4 border-primary opacity-30 animate-ping" />
                    <span className="relative w-12 h-12 flex items-center justify-center">
                        <span className="w-8 h-8 rounded-full bg-primary animate-bounce animate-duration-[1500ms]" />
                    </span>
                </div>
                <h3 className="text-xl font-bold text-primary tracking-wider animate-fadeIn animate-duration-1000">
                    {BRAND.name}
                </h3>
                <p className="text-muted-foreground text-sm tracking-wide animate-fadeIn animate-delay-300">
                    {BRAND.loadingText}
                </p>
            </div>
        </div>
    );
}
