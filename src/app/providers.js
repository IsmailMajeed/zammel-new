'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import store, { persistor } from '@/redux/store';
import Cart from '@/components/Cart';
import Wishlist from '@/components/Wishlist';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SpeedInsights } from "@vercel/speed-insights/next"

export function Providers({ children }) {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
                <ThemeProvider>
                    {children}
                    <Cart />
                    <Wishlist />
                    <SpeedInsights />
                    <Toaster position="top-right" />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

