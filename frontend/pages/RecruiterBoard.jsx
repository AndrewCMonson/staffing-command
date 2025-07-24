import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import UploadForm from '../components/UploadForm';
import RefreshButton from '../components/RefreshButton';

const fetchBoardData = async () => {
	try {
		const res = await fetch('/board');
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Backend error (${res.status}): ${text}`);
		}
		return await res.json();
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

export default function RecruiterBoard() {
	const [columns, setColumns] = useState([]);

	const loadBoard = () => fetchBoardData().then(setColumns);

	useEffect(() => {
		loadBoard();
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
		<div className="min-h-screen bg-gray-800 py-12 px-6">
			<h1 className="text-4xl font-bold text-center text-white mb-10">
				Recruiter Job Board
			</h1>

			<div className="flex flex-wrap justify-center items-center gap-4 mb-10">
				<UploadForm onUploadComplete={loadBoard} />
				<RefreshButton onRefresh={loadBoard} />
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
										className="bg-white rounded-xl shadow-lg p-3 w-full max-w-sm"
									>
										{/* Column header */}
										<h2 className="text-xl font-semibold text-gray-700 px-4 pt-4 pb-2 text-center shrink-0">
											{column.name}
										</h2>

										{/* Scrollable job list */}
										<div className="flex-1 overflow-y-auto scroll-hidden px-4 pb-4 space-y-3">
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
															className="bg-white rounded-md p-3 shadow hover:shadow-md border border-gray-200 cursor-move transition"
														>
															<h3 className="font-semibold text-gray-800 text-sm leading-snug mb-1">
																{job.title}
															</h3>
															<p className="text-xs text-gray-500 mb-1">
																ID: {job.jobId} · {job.companyName}
															</p>
															<p className="text-xs text-gray-500 mb-1">
																Status:{' '}
																<span className="font-medium text-gray-700">
																	{job.jobStatus}
																</span>
															</p>
															<p className="text-xs text-gray-500">
																Owner:{' '}
																<span className="font-medium text-gray-700">
																	{job.firstOwner}
																</span>
															</p>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
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
