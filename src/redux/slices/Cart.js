import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    couponCode: '',
    isOpen: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);

            // Check max quantity limit if provided
            const maxQuantity = product.maxQuantity || Infinity;
            const requestedQuantity = product.quantity || 1;

            if (existingItem) {
                const newQuantity = existingItem.quantity + requestedQuantity;
                if (newQuantity > maxQuantity) {
                    // Don't add if exceeds max quantity - let the UI handle the error message
                    return;
                }
                existingItem.quantity = newQuantity;
            } else {
                if (requestedQuantity > maxQuantity) {
                    // Don't add if exceeds max quantity
                    return;
                }
                state.items.push({
                    ...product,
                    quantity: requestedQuantity,
                    addedAt: new Date().toISOString()
                });
            }

            cartSlice.caseReducers.calculateTotals(state);
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            cartSlice.caseReducers.calculateTotals(state);
        },

        updateQuantity: (state, action) => {
            const { id, quantity, maxQuantity } = action.payload;
            const item = state.items.find(item => item.id === id);

            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    // Check max quantity limit if provided
                    const finalQuantity = maxQuantity ? Math.min(quantity, maxQuantity) : quantity;
                    item.quantity = finalQuantity;
                }
                cartSlice.caseReducers.calculateTotals(state);
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
            state.shipping = 0;
            state.tax = 0;
            state.discount = 0;
            state.couponCode = '';
        },

        applyCoupon: (state, action) => {
            const { code, discount } = action.payload;
            state.couponCode = code;
            state.discount = discount;
            cartSlice.caseReducers.calculateTotals(state);
        },

        removeCoupon: (state) => {
            state.couponCode = '';
            state.discount = 0;
            cartSlice.caseReducers.calculateTotals(state);
        },

        setShipping: (state, action) => {
            state.shipping = action.payload;
            cartSlice.caseReducers.calculateTotals(state);
        },

        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },

        openCart: (state) => {
            state.isOpen = true;
        },

        closeCart: (state) => {
            state.isOpen = false;
        },

        calculateTotals: (state) => {
            state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

            const subtotal = state.items.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            state.tax = subtotal * 0.08; // 8% tax
            state.total = subtotal + state.shipping + state.tax - state.discount;
        },

        loadCartFromStorage: (state, action) => {
            const savedCart = action.payload;
            if (savedCart) {
                state.items = savedCart.items || [];
                state.couponCode = savedCart.couponCode || '';
                state.discount = savedCart.discount || 0;
                cartSlice.caseReducers.calculateTotals(state);
            }
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    setShipping,
    toggleCart,
    openCart,
    closeCart,
    calculateTotals,
    loadCartFromStorage
} = cartSlice.actions;

export default cartSlice.reducer;
