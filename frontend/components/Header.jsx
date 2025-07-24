import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
	const location = useLocation();

	const navItems = [
		{ label: 'Home', path: '/' },
		{ label: 'Recruiter Board', path: '/recruiter-board' },
		{ label: 'Sales Standups', path: '/sales-standups' },
		{ label: 'Recruiter Standups', path: '/recruiter-standups' },
	];

	return (
		<header className="bg-[#0063b0] text-white shadow-md w-full">
			<div className="px-6 py-4 flex justify-between items-center">
				{/* Logo + Title */}
				<div className="flex items-center gap-3">
					<img src="/edLogo.png" alt="Logo" className="h-16 w-auto" />
					<h1 className="text-xl font-bold">Elevate Dashboard</h1>
				</div>

				{/* Nav Links */}
				<nav className="flex gap-4">
					{navItems.map(item => (
						<Link
							key={item.path}
							to={item.path}
							className={`px-3 py-1 rounded hover:bg-[#00aeef] transition ${
								location.pathname === item.path ? 'bg-[#00aeef]' : ''
							}`}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
};

export default Header;
