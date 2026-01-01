import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface UserState {
  token?: string;
  email?: string;
  name?: string;
}

const initialState: UserState = {
  token: undefined,
  email: undefined,
  name: undefined,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.token = undefined;
      state.email = undefined;
      state.name = undefined;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

export const selectToken = (state: RootState) => state.user?.token;
export const selectUser = (state: RootState) => state.user;

