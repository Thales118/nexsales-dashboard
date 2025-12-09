import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Simulated login API
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulated validation
    if (email === 'admin@nexsales.com' && password === 'admin123') {
      return {
        id: '1',
        email,
        name: 'Alex Johnson',
        role: 'admin' as const,
        avatar: undefined,
      };
    }
    
    if (email && password.length >= 6) {
      return {
        id: '2',
        email,
        name: email.split('@')[0],
        role: 'analyst' as const,
        avatar: undefined,
      };
    }
    
    return rejectWithValue('Invalid credentials. Try admin@nexsales.com / admin123');
  }
);

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
