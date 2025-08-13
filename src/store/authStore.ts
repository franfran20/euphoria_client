"use client";

import axios from "axios";
import { Address } from "viem";
import { create } from "zustand";

interface AuthStoreInterface {
  user: null | Address;
  isAuthenticated: boolean;
  error: null | string;
  isLoading: boolean;
  isCheckingAuth: boolean;

  signIn: (message: string, signature: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logOut: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAuthStore = create<AuthStoreInterface>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signIn: async (message: string, signature: string) => {
    set({ isLoading: true, error: null });

    let response;
    try {
      response = await api.post(`/auth/verify`, {
        message,
        signature,
      });
      // store the token in local storage
      localStorage.setItem("authToken", response.data.token);
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        error: response?.data.msg,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    let response;
    try {
      response = await api.get(`/auth/checkAuth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        user: null,
        error: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  logOut: async () => {
    set({ isLoading: true, error: null });

    let response;
    try {
      response = await api.post(`/auth/logout`);
      set({
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        isLoading: false,
      });
      localStorage.removeItem("authToken");
    } catch (error) {
      set({
        error: null,
        isLoading: false,
      });
    }
  },
}));
