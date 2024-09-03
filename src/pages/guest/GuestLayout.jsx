import React, { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function GuestLayout() {
    const [user, setUser] = useState(localStorage.getItem('user') || null)
    
	useEffect(()=>{
		
		// if user is logged in, redirect to landing page
		if (user) {
			return <Navigate to="/" />;
		}

	}, [])

	return (
		<>
			<Outlet />
		</>
	);
}