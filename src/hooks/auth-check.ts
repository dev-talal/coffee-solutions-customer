"use client";

import { useAuth } from "@/providers/AuthProvider";

export const useAuthCheck = () => {
  const {
    user,
    loading,
    isAuthenticated,
    clearToken,
    updateProfile,
    actionLoader,
    logout,
    syncGuestCart,
  } = useAuth();

  return {
    user,
    loading,
    isAuthenticated,
    clearToken,
    updateProfile,
    actionLoader,
    logout,
    syncGuestCart,
  };
};
