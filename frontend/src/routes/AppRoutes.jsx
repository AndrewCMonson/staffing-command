// FILE: /frontend/src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from '../../pages/HomePage.jsx';
import RecruiterBoard from '../../pages/RecruiterBoard.jsx';
// import SalesStandups from '../pages/SalesStandups.jsx';
// import RecruiterStandups from '../pages/RecruiterStandups.jsx';
import Header from '../../components/Header.jsx';

export default function AppRoutes() {
	const location = useLocation();
	const hideHeaderOn = ['/'];
	const showHeader = !hideHeaderOn.includes(location.pathname);

	return (
		<>
			{showHeader && <Header />}
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/recruiter-board" element={<RecruiterBoard />} />
				{/* <Route path="/sales-standups" element={<SalesStandups />} />
				<Route path="/recruiter-standups" element={<RecruiterStandups />} /> */}
			</Routes>
		</>
	);
}
