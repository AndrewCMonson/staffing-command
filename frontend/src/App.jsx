// FILE: /frontend/src/App.jsx

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import UploadForm from '../components/UploadForm.jsx';
import RefreshButton from '../components/RefreshButton.jsx';
import './index.css';

const fetchBoardData = async () => {
	try {
		const res = await fetch('/board');

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Backend error (${res.status}): ${text}`);
		}

		const data = await res.json();
		return data;
	} catch (err) {
		console.error('🚨 Failed to load board data:', err);
		return [];
	}
};

const reassignJob = async (jobId, toRecruiterId) => {
	await fetch('/board/reassign-job', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ jobId, toRecruiterId }),
	});
};

function App() {
	const [columns, setColumns] = useState([]);

	useEffect(() => {
		fetchBoardData().then(setColumns);
	}, []);

	const onDragEnd = async result => {
		const { source, destination, draggableId } = result;
		if (!destination || source.droppableId === destination.droppableId) return;

		const fromCol = columns.find(col => col.recruiterId === source.droppableId);
		const toCol = columns.find(
			col => col.recruiterId === destination.droppableId
		);
		const movedJob = fromCol.jobs.find(job => job.id === draggableId);

		const updatedCols = columns.map(col => {
			if (col.recruiterId === fromCol.recruiterId) {
				return { ...col, jobs: col.jobs.filter(job => job.id !== draggableId) };
			}
			if (col.recruiterId === toCol.recruiterId) {
				return { ...col, jobs: [...col.jobs, movedJob] };
			}
			return col;
		});

		setColumns(updatedCols);
		await reassignJob(draggableId, toCol.recruiterId);
	};

	return (
		<div className="min-h-screen bg-gray-100 py-12 px-6">
			<h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
				Recruiter Job Board
			</h1>

			<div className="flex flex-wrap justify-center items-center gap-4 mb-10">
				<div className="flex-shrink-0">
					<UploadForm
						onUploadComplete={() => fetchBoardData().then(setColumns)}
					/>
				</div>
				<div className="flex-shrink-0">
					<RefreshButton onRefresh={() => fetchBoardData().then(setColumns)} />
				</div>
			</div>

			<div className="max-w-7xl mx-auto">
				<DragDropContext onDragEnd={onDragEnd}>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
						{columns.map(column => (
							<Droppable
								key={column.recruiterId}
								droppableId={column.recruiterId}
							>
								{provided => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="bg-white rounded-xl shadow-lg p-5 w-full max-w-sm"
									>
										<h2 className="text-xl font-semibold text-gray-700 mb-5 text-center">
											{column.name}
										</h2>

										{column.jobs.map((job, index) => (
											<Draggable
												key={job.id}
												draggableId={job.id}
												index={index}
											>
												{provided => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className="bg-gray-50 rounded-md p-4 mb-4 shadow-sm hover:shadow-md border border-gray-200 cursor-grab transition"
													>
														<h3 className="font-semibold text-gray-800 text-sm mb-1">
															{job.title || 'Untitled'}
														</h3>
														<p className="text-xs text-gray-500">
															ID: {job.jobId || 'N/A'} ·{' '}
															{job.companyName || 'N/A'}
														</p>
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						))}
					</div>
				</DragDropContext>
			</div>
		</div>
	);
}

export default App;
