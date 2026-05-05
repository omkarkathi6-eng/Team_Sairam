// import * as React from "react";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
// // import { AuthProvider } from "@/components/providers/auth-provider";
// import { AuthProvider } from "@/components/providers/custom_auth-provider";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Jobraze - AI-Powered Career & Staffing Platform",
//   description: "Where Ambition Meets Intelligence.",
//   generator: "v0.dev",
// };

// export default async function RootLayout({ children }) {
//   const session = await getServerSession(authOptions);
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={inter.className}>
//         <AuthProvider>
//           <ThemeProvider
//             attribute="class"
//             defaultTheme="light"
//             enableSystem
//             disableTransitionOnChange
//           >
//             {children}
//           </ThemeProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }

import * as React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/custom_auth-provider";
import { SessionWrapper } from "@/components/providers/SessionWrapper"; // your wrapper
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Use system font stack for better performance and offline support
const systemFont = {
  className: "font-sans",
  style: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
};

export const metadata = {
  title: "Jobraze - AI-Powered Career & Staffing Platform",
  description: "Where Ambition Meets Intelligence.",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={systemFont.className} style={systemFont.style}>
        <SessionWrapper>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <ToastContainer position="top-center" autoClose={3000} />
            </ThemeProvider>
          </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
