import {React, useEffect, useState} from 'react';
import './App.css'
import { RouterProvider } from 'react-router-dom';
import Axios from './constant/axios'
import routes from './routes';
import { Toaster } from 'react-hot-toast';

const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  const expirationTime = localStorage.getItem('expirationTime');
  if (token && expirationTime) {
      const now = new Date();
      const expired = now.getTime() > parseInt(expirationTime, 10);

      if (expired) {

          Axios.post('/logout')
          .then((res) => console.log(res))
          .catch((rej) => console.log(rej))

          // Token expired, clear localStorage and log out
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('expirationTime');

          // Redirect or show a message indicating that the user has been logged out
          window.location.href = '/guest/login'
      }

  }

};

function App() {
  
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
    // check if user is logged in or not from server
    useEffect(() => {

      if (user) {

        Axios.get('/user-role')
        .then(res => {

          localStorage.setItem('user', JSON.stringify({...user, number : res.data.id, role : res.data.role}));
          
        })
        .catch ((rej) => {
          
          if(rej.response.status === 401){

            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('expirationTime');
            
          }
        })

      }

      // Check token expiration every hour
      const interval = setInterval(checkTokenExpiration, 1 * 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, []);

  return (
    <>
    <Toaster/>
    <RouterProvider router={routes}/>
    </>
  );

}

export default App;
