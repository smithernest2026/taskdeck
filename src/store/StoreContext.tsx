import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { reducer, type Action, type AppState } from './reducer';
import { loadState, saveState } from '../lib/storage';
import { seedProjects, seedTasks } from '../data/seed';

const STORAGE_KEY = 'taskdeck.state.v1';

function getInitialState(): AppState {
  return loadState<AppState>(STORAGE_KEY, {
    tasks: seedTasks,
    projects: seedProjects,
  });
}

interface StoreValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Persist state whenever it changes.
  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return value;
}
