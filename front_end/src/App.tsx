import React from 'react';
import NavbarWeb from './components/NavbarWeb';
import SiteRoutes from './components/SiteRoutes'; // Import SiteRoutes

function App() {
  return (
    <div>
      <h1> Redux <br/> Auth with Northwind </h1>
      <NavbarWeb />
      <SiteRoutes /> {/* Include SiteRoutes here */}
    </div>
  );
}

export default App;
