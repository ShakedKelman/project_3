
// In SiteRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VacationCard from './VacationCard';
import LoginComponent from './Login';
import RegisterComponent from './Register';
import AddVacationForm from './AddVactionForm';
import Logout from './Logout';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import EditVacationForm from './EditVacationForm';


const SiteRoutes: React.FC = () => {
  const { status, loginTimestamp, user } = useSelector((state: RootState) => state.auth);
  const FIVE_MINUTES = 5 * 60 * 1000;
  const isAuthenticated = status === 'succeeded' && loginTimestamp && Date.now() - loginTimestamp <= FIVE_MINUTES;
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
        element={isAuthenticated ? <VacationCard /> : <Navigate to="/login" />}
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