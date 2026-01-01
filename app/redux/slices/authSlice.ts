import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface Employee {
  code?: string;
  name?: string;
  surName?: string;
  idCard?: string;
  dateOfBirth?: string;
  age?: number;
  current?: string;
  description?: string;
  department?: string;
  position?: string;
  [key: string]: any;
}

interface AuthState {
  token?: string;
  employees: Employee[];
}

const initialState: AuthState = {
  token: undefined,
  employees: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.token = undefined;
      state.employees = [];
    },
    updateEmployees: (state, action) => {
      console.log('Updating employees:', action.payload);
      state.employees = action.payload;
    },
  },
});

export const { login, logout, updateEmployees } = authSlice.actions;
export default authSlice.reducer;

export const selectToken = (state: RootState) => state.auth?.token;
export const selectEmployees = (state: RootState) => state.auth?.employees;

