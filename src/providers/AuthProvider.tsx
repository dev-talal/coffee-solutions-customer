"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  AuthCheck,
  postLogin,
  postLogout,
  postUpdateProfile,
  syncCart,
} from "@/services/apiService";
import Cookies from "js-cookie";
import { createGuestId, getGuestId, removeGuestId } from "@/helpers/dataFormat";
import { ProfileSchemaType } from "@/lib/validations/auth";
import { AxiosError } from "axios";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null | undefined;
  profile: string | null;
  credit: string;
  created_at: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  actionLoader: boolean;
  clearToken: () => void;
  updateProfile: (data: ProfileSchemaType) => Promise<void>;
  syncGuestCart: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  fetchUser: async () => {},
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  actionLoader: false,
  clearToken: () => {},
  updateProfile: async () => {},
  syncGuestCart: async () => {},
});

const authToken = Cookies.get(
  process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string
);

export const AuthProvider = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const isTokenExist = authToken ? true : false;
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenExist);
  const [actionLoader, setActionLoader] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await AuthCheck();
      if (getGuestId()) {
        syncGuestCart();
      }
      setIsAuthenticated(true);
      setUser(res);
    } catch (error) {
      const err = error as AxiosError;
      setIsAuthenticated(false);
      if (err.response?.status === 401) {
        createGuestId();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    setActionLoader(true);

    try {
      const res = await postLogin(email, password);
      Cookies.set(
        process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string,
        res.data.data.access_token,
        {
          expires: new Date(res.data.data.expires_at),
        }
      );
      setIsAuthenticated(res.data.data.access_token);

      window.location.href = !redirect ? `/${locale}` : redirect;
    } catch {
      setUser(null);
    } finally {
      setActionLoader(false);
    }
  };

  const updateProfile = async (data: ProfileSchemaType) => {
    setActionLoader(true);
    const payload: Partial<ProfileSchemaType> = { ...data };

    if (data.profile instanceof FileList && data.profile.length > 0) {
      payload.profile = data.profile[0];
    } else {
      delete payload.profile;
    }

    delete payload.email;
    try {
      const res = await postUpdateProfile(payload as ProfileSchemaType);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setActionLoader(false);
    }
  };

  const clearToken = () => {
    Cookies.remove(process.env.NEXT_PUBLIC_COOKIE_TOKEN_NAME as string);
  };

  const syncGuestCart = async () => {
    try {
      await syncCart();
      removeGuestId();
    } catch {}
  };

  const logout = async () => {
    setActionLoader(true);
    try {
      await postLogout();
      setIsAuthenticated(false);
      clearToken();
      window.location.href = `/${locale}`;
    } catch {
      setUser(null);
    } finally {
      setActionLoader(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        login,
        isAuthenticated,
        actionLoader,
        logout,
        clearToken,
        updateProfile,
        syncGuestCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
