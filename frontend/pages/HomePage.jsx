import React from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
	return (
		<div className="min-h-screen bg-gray-800 flex items-center justify-center px-4">
			<div className="flex flex-col items-center text-center max-w-2xl">
				<img src='../public/edLogo.png' alt="Logo" className="h-60 mb-6" />

				<h1 className="text-4xl font-bold text-white mb-4">
					Staffing Command Center
				</h1>
				<p className="text-gray-300 mb-10">
					Choose a module below to get started.
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
					<Link
						to="/recruiter-board"
						className="bg-white text-gray-800 py-3 px-6 rounded-xl shadow-md transition"
					>
						Recruiter Job Board
					</Link>

					<Link
						to="/sales-standups"
						className="bg-white text-gray-800 py-3 px-6 rounded-xl shadow-md transition"
					>
						Sales Standups
					</Link>

					<Link
						to="/recruiter-standups"
						className="bg-white text-gray-800 py-3 px-6 rounded-xl shadow-md transition"
					>
						Recruiter Standups
					</Link>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
