
// In SiteRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VacationCard from '../vacations/VacationCard';
import LoginComponent from '../auth/Login';
import RegisterComponent from '../auth/Register';
import AddVacationForm from '../forms/AddVactionForm';
import Logout from '../auth/Logout';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import EditVacationForm from '../forms/EditVacationForm';
import VacationList from '../vacations/VacationsList';


const SiteRoutes: React.FC = () => {
  const { status, loginTimestamp, user } = useSelector((state: RootState) => state.auth);
  const TEN_MINUTES = 100 * 60 * 1000;
  const isAuthenticated = status === 'succeeded' && loginTimestamp && Date.now() - loginTimestamp <= TEN_MINUTES;
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
        path="/vacations"
        element={isAuthenticated ? <VacationList /> : <Navigate to="/login" />}
      />
      <Route
        path="/add-vacation"
        element={isAuthenticated && isAdmin ? <AddVacationForm /> : <Navigate to="/vacations" />} // Only admins can access
      />
      <Route
                path="/edit-vacation/:id"
                element={isAuthenticated && isAdmin ? <EditVacationForm /> : <Navigate to="/vacations" />}
            />

      <Route
        path="/logout"
        element={isAuthenticated ? <Logout /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default SiteRoutes;

// const SiteRoutes: React.FC = () => {
//   const { status, loginTimestamp } = useSelector((state: RootState) => state.auth);
//   const FIVE_MINUTES = 5 * 60 * 1000;
//   const isAuthenticated = status === 'succeeded' && loginTimestamp && Date.now() - loginTimestamp <= FIVE_MINUTES;

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/login" element={isAuthenticated ? <Navigate to="/vacations" /> : <LoginComponent />} />
//       <Route path="/register" element={<RegisterComponent />} />
      
//       {/* Home Redirect */}
//       <Route 
//         path="/" 
//         element={isAuthenticated ? <Navigate to="/vacations" /> : <Navigate to="/login" />} 
//       />
      
//       {/* Protected Routes */}
//       <Route
//         path="/vacations"
//         element={isAuthenticated ? <VacationCard /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/add-vacation"
//         element={isAuthenticated ? <AddVacationForm /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/logout"
//         element={isAuthenticated ? <Logout /> : <Navigate to="/login" />}
//       />
//     </Routes>
//   );
// };

// export default SiteRoutes;