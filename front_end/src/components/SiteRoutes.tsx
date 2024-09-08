import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VacationCard from './VacationCard'; // Adjust import path as needed
import LoginComponent from './Login';
import RegisterComponent from './Register';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AddVacationForm from './AddVactionForm';

const SiteRoutes: React.FC = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/register" element={<RegisterComponent />} />
      
      {/* Redirect home to login page */}
      <Route path="/" element={<Navigate to="/login" />} />
      
      {/* Protected Routes */}
      <Route
        path="/vacations"
        element={authStatus === 'succeeded' ? <VacationCard /> : <Navigate to="/login" />}
      />
      <Route
        path="/add-vacation"
        element={authStatus === 'succeeded' ? <AddVacationForm /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default SiteRoutes;
