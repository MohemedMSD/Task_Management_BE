import { createBrowserRouter, Navigate } from 'react-router-dom';
import './App.css'
import {
	GuestLayout,
	Dashboard,
	Login,
	Register,
    Home,
    Users,
    Tasks,
	MyTasks
} from "./pages";


const router = createBrowserRouter([
	{
		path: '/guest' , 
		element : <GuestLayout />,
		children : [
			{
				path: '/guest/login',
				element: <Login />,
			},
			{
				path: '/guest/register',
				element: <Register />
			}
		],
	},
	{
		path: '/',
		element: <Dashboard />,
		children: [
            {
                path : '/',
                element : <Home />
            },
            {
                path : '/users',
                element : <Users />
            },
            {
                path : '/tasks',
                element : <Tasks />
            },
			{
                path : '/my-tasks',
                element : <MyTasks />
            }
        ]
	},
    {
        path : '*',
        element : <Navigate to={localStorage.getItem('user') ? '/' : '/guest/login'}/>
    }
]);

export default router;