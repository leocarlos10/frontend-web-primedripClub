import type { LoginResponse } from "../requestType/LoginResponse";

export type AuthContextType = {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  logout: () => void;
  refreshAuth: () => void;
};
