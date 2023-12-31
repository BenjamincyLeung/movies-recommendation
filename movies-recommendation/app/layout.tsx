import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Categories } from "./model";
import NavBar from "./NavBar";
import AuthProvider from "./auth/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetch("http://localhost:3000/api/categories");
  const categories: Categories[] = await res.json();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar categories={categories} />
          <main className="p-5">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
