import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/core/application/store";
import { ThemeProvider } from "@/components/theme-provider";
import ScriptComponent from "@/components/ScriptComponent";


const inter = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Easy Univ",
  description: "Best online university management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className={inter.className}>
        <>

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ScriptComponent />
            {children}
          </ThemeProvider>
        </>
        
      </body>
      
    </html>
  );
}
