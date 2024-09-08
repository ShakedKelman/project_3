import React, { useEffect } from 'react';
import NavbarWeb from './components/NavbarWeb';
import SiteRoutes from './components/SiteRoutes';
import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './store/slices/authSlice';
import { AppDispatch } from './store/store';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem('user');
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      const FIVE_MINUTES = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (user && loginTimestamp) {
        const parsedUser = JSON.parse(user);
        const parsedTimestamp = parseInt(loginTimestamp, 10);

        if (Date.now() - parsedTimestamp <= FIVE_MINUTES) {
          dispatch(loginSuccess({ user: parsedUser, timestamp: parsedTimestamp }));
        } else {
          dispatch(logout());
          localStorage.removeItem('user');
          localStorage.removeItem('loginTimestamp');
        }
      }
    };

    checkAuthStatus();

    // Set up an interval to check auth status regularly
    const intervalId = setInterval(checkAuthStatus, 60000); // Check every minute

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
