import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Page404 from './pages/Page404.jsx';
import Profilo from './pages/Profilo.jsx';
import Impostazioni from './pages/Impostazioni.jsx';
import PrivacyPolicyDialog from './pages/PrivacyPolicyDialog.jsx';
import FormCogestione from './pages/FormCogestione.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profilo",
    element: <Profilo />,
  },
  {
    path: "/cogestione",
    element: <FormCogestione />,
  },
  {
    path: "/impostazioni",
    element: <Impostazioni />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicyDialog />,
  },
  {
    path: "*",
    element: <Page404 />
  }
]);

function App() {
  return (

    <RouterProvider router={router} />

  );
}

export default App;
