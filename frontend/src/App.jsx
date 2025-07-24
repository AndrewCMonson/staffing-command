import React from 'react';
import { Link } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
	return (
		<div className="min-h-screen bg-gray-800">
			<AppRoutes />
		</div>
	);
}
