import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VacationCard from './VacationCard'; // Adjust import path as needed
import LoginComponent from './Login';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import RegisterComponent from './Register';
import AddVacationForm from './AddVactionForm';

const SiteRoutes: React.FC = () => {
  const authStatus = useSelector((state: RootState) => state.auth.status);

  return (
    <Routes>
      <Route path="/login" element={<LoginComponent />} />
      {/* <Route path="/register" element={<RegisterComponent />} /> */}
      <Route path="/register" element={<RegisterComponent />} />
      <Route path="/" element={<RegisterComponent />} />

      <Route 
        path="/vacations" 
        element={authStatus === 'succeeded' ? <VacationCard /> : <Navigate to="/login" />} 
      />
                <Route path="/add-vacation" element={<AddVacationForm />} />

    </Routes>
  );
};

export default SiteRoutes;
