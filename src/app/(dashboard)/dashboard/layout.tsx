import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children } : { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard - Restaurant</title>
        <meta name="description" content="Restaurant Admin Dashboard" />
      </Head>

      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Restaurant Admin</h1>
          <div className="space-x-4">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <Link href="#" className="hover:underline">Orders</Link>
            <Link href="#" className="hover:underline">Settings</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;