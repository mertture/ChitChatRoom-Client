import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { checkAuthentication } from './auth/auth';
import Dashboard from './pages/dashboard/dashboard';
//import Login from './pages/login/login';
import Register from './pages/register/register';
import Loading from './pages/loading/loading';

import User from './models/user/user';


function App() {

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { pathname } = location;
  const token: string = localStorage.getItem("token")!;
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Perform any asynchronous operations here, and then set the loading state to false
    const checkAuth = async () => {
      const userValue: User = await checkAuthentication(pathname, token)!;
      setUser(userValue);
    };
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {!user ?
        <>
        <Route path="/register" Component={Register} />
        <Route path="*" Component={Register} />
        </>
        :
        <>
        <Route path="/dashboard" Component={Dashboard} />
        </>
        }
      </Routes>
    </React.Suspense>

  );
}

export default App;
