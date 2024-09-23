"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { Provider } from "react-redux";
import { store } from "@/core/application/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <Provider store={store}>
        <ToastContainer />
        {children}
        </Provider>
    </NextThemesProvider>
  );
}
