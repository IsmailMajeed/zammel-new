import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  customers: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    tier: 'all',
    dateRange: { start: null, end: null }
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
    addCustomer: (state, action) => {
      state.customers.unshift(action.payload);
    },
    updateCustomer: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.customers.findIndex(customer => customer.id === id);
      if (index !== -1) {
        state.customers[index] = { ...state.customers[index], ...updates };
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    toggleCustomerStatus: (state, action) => {
      const customer = state.customers.find(c => c.id === action.payload);
      if (customer) {
        customer.status = customer.status === 'active' ? 'inactive' : 'active';
      }
    },
    updateCustomerTier: (state, action) => {
      const { id, tier } = action.payload;
      const customer = state.customers.find(c => c.id === id);
      if (customer) {
        customer.tier = tier;
      }
    },
    addCustomerNote: (state, action) => {
      const { customerId, note } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      if (customer) {
        if (!customer.notes) customer.notes = [];
        customer.notes.push({
          id: Date.now(),
          note,
          createdAt: new Date().toISOString(),
          createdBy: 'admin'
        });
      }
    },
    updateCustomerAddress: (state, action) => {
      const { customerId, address } = action.payload;
      const customer = state.customers.find(c => c.id === customerId);
      if (customer) {
        customer.shippingAddress = address;
      }
    }
  },
});

export const {
  setLoading,
  setError,
  setCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setFilters,
  setPagination,
  toggleCustomerStatus,
  updateCustomerTier,
  addCustomerNote,
  updateCustomerAddress
} = customersSlice.actions;

export default customersSlice.reducer;
