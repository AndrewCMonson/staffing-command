import React from 'react';

export default function UploadModal({ isOpen, onClose, title, children }) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
				<h2 className="text-xl font-semibold mb-4">{title}</h2>
				<div className="mb-4">{children}</div>
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
