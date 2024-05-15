import { create } from 'zustand';

// Define interfaces for the state and actions
interface PasswordVisibilityState {
  showPassword: boolean;
  showPassword2: boolean;
  showConfirmPassword: boolean;
}

interface PasswordVisibilityActions {
  toggleShowPassword: () => void;
  toggleShowPassword2: () => void;
  toggleShowConfirmPassword: () => void;
}

// Combine state and actions into a single type
type UsePasswordVisibilityStore = PasswordVisibilityState & PasswordVisibilityActions;

// Define the store using Zustand with TypeScript typings
const usePasswordVisibilityStore = create<UsePasswordVisibilityStore>((set) => ({
  showPassword: false,
  showPassword2: false,
  showConfirmPassword: false,
  toggleShowPassword: () => set((state) => ({ showPassword: !state.showPassword })),
  toggleShowPassword2: () => set((state) => ({ showPassword2: !state.showPassword2 })),
  toggleShowConfirmPassword: () =>
    set((state) => ({ showConfirmPassword: !state.showConfirmPassword })),
}));

export default usePasswordVisibilityStore;
