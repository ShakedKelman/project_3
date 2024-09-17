import React, { useEffect } from 'react';
import NavbarWeb from './components/navigation/NavbarWeb';
import SiteRoutes from './components/navigation/SiteRoutes';
import { useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import { AppDispatch } from './store/store';
import { checkAuthStatus } from './utils/checkStatus';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const performAuthCheck = () => {
      try {
        checkAuthStatus(dispatch);
      } catch (error) {
        console.error('Error performing auth check:', error);
        // Handle potential errors here
      }
    };

    // Initial check
    performAuthCheck();

    // Set up an interval to check auth status regularly
    const intervalId = setInterval(performAuthCheck, 60000); // Check every minute

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div>
      <NavbarWeb />
      <SiteRoutes />
    </div>
  );
};

export default App;
