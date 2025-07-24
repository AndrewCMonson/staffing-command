import React, { useState } from 'react';
import UploadModal from './UploadModal.jsx';

export default function UploadForm({onUploadComplete}) {
	const [isUploading, setIsUploading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [stats, setStats] = useState({ updated: 0, created: 0, raw: '' });

	const handleUpload = async e => {
		e.preventDefault();
		const formData = new FormData(e.target);
		setIsUploading(true);
		setStats({ updated: 0, created: 0, raw: '' });

		try {
			const res = await fetch('/upload', {
				method: 'POST',
				body: formData,
			});
			const text = await res.text();
			const match = text.match(/Updated: (\d+), Created: (\d+)/);
			if (match) {
				setStats({
					updated: parseInt(match[1]),
					created: parseInt(match[2]),
					raw: text,
				});
			} else {
				setStats({ updated: 0, created: 0, raw: text });
			}
			setModalOpen(true);
			if (typeof onUploadComplete === 'function') {
				onUploadComplete(); // 🔁 Trigger refresh
			}
		} catch (err) {
			console.error('Upload error:', err);
			setStats({ updated: 0, created: 0, raw: '❌ Upload failed.' });
			setModalOpen(true);
		} finally {
			setIsUploading(false);
			e.target.reset();
		}
	};

	return (
		<>
			<form
				onSubmit={handleUpload}
				className="flex flex-col sm:flex-row items-center gap-3"
			>
				<input
					type="file"
					name="file"
					accept=".csv"
					required
					className="text-sm bg-white rounded border border-gray-300 px-3 py-1 w-60 shadow-sm"
				/>

				<button
					type="submit"
					disabled={isUploading}
					className={`inline-flex items-center justify-center h-10 px-5 text-sm font-medium rounded bg-green-600 text-white shadow hover:bg-green-700 transition ${
						isUploading ? 'opacity-70 cursor-not-allowed' : ''
					}`}
				>
					{isUploading && (
						<span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
					)}
					{isUploading ? 'Syncing...' : 'Upload + Sync'}
				</button>
			</form>

			<UploadModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Upload Results"
			>
				<p className="text-sm text-gray-700 mb-1">
					✅ {stats.updated} jobs updated
				</p>
				<p className="text-sm text-gray-700 mb-3">
					➕ {stats.created} jobs created
				</p>
				<pre className="bg-gray-100 text-xs p-2 rounded text-gray-600 overflow-x-auto">
					{stats.raw}
				</pre>
			</UploadModal>
		</>
	);
}
