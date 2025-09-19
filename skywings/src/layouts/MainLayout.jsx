import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/navbar/Navbar';
import Footer from '../components/ui/footer/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
