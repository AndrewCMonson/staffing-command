import React, { useState } from 'react';

export default function RefreshButton({ onRefresh }) {
	const [loading, setLoading] = useState(false);

	const handleRefresh = async () => {
		setLoading(true);
		await onRefresh();
		setLoading(false);
	};

	return (
		<button
			onClick={handleRefresh}
			disabled={loading}
			className={`h-10 px-5 text-sm font-medium rounded bg-blue-600 text-white shadow hover:bg-blue-700 transition flex items-center justify-center ${
				loading ? 'opacity-70 cursor-not-allowed' : ''
			}`}
		>
			{loading && (
				<span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
			)}
			{loading ? 'Refreshing...' : 'Refresh Board'}
		</button>
	);
}
