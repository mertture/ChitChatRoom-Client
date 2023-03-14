import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { checkAuthentication } from './auth/auth';
import Dashboard from './pages/dashboard/dashboard';
import './styles/global.css'

//import Login from './pages/login/login';
import Register from './pages/register/register';
import Login from './pages/login/login';
import Loading from './pages/loading/loading';

import User from './models/user/user';


function App() {

  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { pathname } = location;
  const token: string = localStorage.getItem("token")!;
  const [user, setUser] = useState<User | null>(null);

  const checkAuth = async () => {
    const userValue: User = await checkAuthentication(pathname, token)!;
    setUser(userValue);
  };

  useEffect(() => {
    checkAuth();
    setLoading(false);
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {user === null ?
        <>
        <Route path="/register" Component={Register} />
        <Route path="/login" Component={Login} />
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
