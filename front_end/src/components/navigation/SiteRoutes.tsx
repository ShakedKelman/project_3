import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from '../auth/Login';
import RegisterComponent from '../auth/Register';
import Logout from '../auth/Logout';
import EditVacationForm from '../forms/EditVacationForm';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AddVacationForm from '../forms/AddVactionForm';
import VacationList from '../vacations/VacationsList';
import Report from '../vacationReport';

const SiteRoutes: React.FC = () => {
  const { status, user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = status === 'succeeded' && user !== null;
  const isAdmin = user?.isAdmin;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/vacations" /> : <LoginComponent />} />
      <Route path="/register" element={<RegisterComponent />} />

      {/* Home Redirect */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/vacations" /> : <Navigate to="/login" />} 
      />

      {/* Protected Routes */}
      <Route
  path="/report"
  element={isAuthenticated && isAdmin ? <Report token={user.token} /> : <Navigate to="/vacations" />}
/>

      <Route
        path="/vacations"
        element={isAuthenticated ? <VacationList /> : <Navigate to="/login" />}
      />
      <Route
        path="/add-vacation"
        element={isAuthenticated && isAdmin ? <AddVacationForm token={user.token}/> : <Navigate to="/vacations" />} // Only admins can access
      />
      <Route
        path="/edit-vacation/:id"
        element={isAuthenticated && isAdmin ? <EditVacationForm token={user.token} /> : <Navigate to="/vacations" />}
      />

      <Route
        path="/logout"
        element={isAuthenticated ? <Logout /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default SiteRoutes;
