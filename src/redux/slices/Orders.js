import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: { start: null, end: null }
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrder: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.orders.findIndex(order => order.id === id);
      if (index !== -1) {
        state.orders[index] = { ...state.orders[index], ...updates };
      }
    },
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(order => order.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
      }
    },
    updatePaymentStatus: (state, action) => {
      const { id, paymentStatus } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.paymentStatus = paymentStatus;
        order.updatedAt = new Date().toISOString();
      }
    },
    addOrderNote: (state, action) => {
      const { orderId, note } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        if (!order.notes) order.notes = [];
        order.notes.push({
          id: Date.now(),
          note,
          createdAt: new Date().toISOString(),
          createdBy: 'admin'
        });
      }
    },
    updateOrderTracking: (state, action) => {
      const { id, trackingNumber, carrier } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.trackingNumber = trackingNumber;
        order.carrier = carrier;
        order.shippedAt = new Date().toISOString();
      }
    }
  },
});

export const {
  setLoading,
  setError,
  setOrders,
  addOrder,
  updateOrder,
  deleteOrder,
  setFilters,
  setPagination,
  updateOrderStatus,
  updatePaymentStatus,
  addOrderNote,
  updateOrderTracking
} = ordersSlice.actions;

export default ordersSlice.reducer;
