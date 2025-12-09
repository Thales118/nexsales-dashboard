import React, { useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Loader2, User } from 'lucide-react';

// 1. Định nghĩa State & Action Types
type State = {
  status: 'idle' | 'loading' | 'resolved' | 'rejected';
  data: { name: string; role: string } | null;
  error: string | null;
};

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: { name: string; role: string } }
  | { type: 'FETCH_FAILURE'; payload: string };

const initialState: State = {
  status: 'idle',
  data: null,
  error: null,
};

// 2. Reducer (FSM Logic)
function dataReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_INIT':
      // Chỉ cho phép loading khi đang idle hoặc đã xong/lỗi (Retry)
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'resolved', data: action.payload, error: null };
    case 'FETCH_FAILURE':
      return { ...state, status: 'rejected', error: action.payload };
    default:
      return state;
  }
}

export const FetchMachine = () => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const fetchUser = async () => {
    dispatch({ type: 'FETCH_INIT' });

    try {
      // Giả lập API call (Random lỗi để test case Error)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const shouldFail = Math.random() < 0.3; // 30% cơ hội lỗi
      if (shouldFail) throw new Error('Simulated Network Error (Try again!)');

      const mockData = { name: 'Pham Trung Kien', role: 'Student (23520803)' };
      dispatch({ type: 'FETCH_SUCCESS', payload: mockData });
    } catch (error: any) {
      dispatch({ type: 'FETCH_FAILURE', payload: error.message });
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Exercise 1.1: The Fetch Machine</h3>
        <span className="px-2 py-1 text-xs font-mono bg-secondary rounded">useReducer</span>
      </div>

      <div className="min-h-[120px] flex items-center justify-center border-2 border-dashed border-muted rounded-lg p-4">
        {state.status === 'idle' && <p className="text-muted-foreground">Ready to fetch data...</p>}
        
        {state.status === 'loading' && (
          <div className="flex flex-col items-center gap-2 text-primary">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Fetching user data...</span>
          </div>
        )}

        {state.status === 'rejected' && (
          <div className="flex flex-col items-center gap-2 text-destructive">
            <AlertTriangle className="w-6 h-6" />
            <span>Error: {state.error}</span>
          </div>
        )}

        {state.status === 'resolved' && state.data && (
          <div className="flex flex-col items-center gap-2 text-green-500 animate-in zoom-in">
            <CheckCircle2 className="w-8 h-8" />
            <div className="text-center">
                <p className="font-bold text-lg">{state.data.name}</p>
                <p className="text-sm opacity-80">{state.data.role}</p>
            </div>
          </div>
        )}
      </div>

      <Button onClick={fetchUser} disabled={state.status === 'loading'} className="w-full">
        {state.status === 'loading' ? 'Processing...' : state.status === 'idle' ? 'Start Fetch' : 'Retry Fetch'}
      </Button>
    </div>
  );
};