import React from 'react';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Sidebar';
import DashboardContent from '../pages/DashboardContent';

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;