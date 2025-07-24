// FILE: controllers/board.js

import { notion, RECRUITER_DATABASE_ID } from './notion.js';
import { findRecruiterRowByName, getNotAssignedRecruiterRow } from './utils.js';
import dotenv from 'dotenv';
dotenv.config();

export async function getBoardData(req, res) {
	try {
		const recruiters = await notion.databases.query({
			database_id: RECRUITER_DATABASE_ID,
		});

		const result = await Promise.all(
			recruiters.results.map(async recruiter => {
				const recruiterName =
					recruiter.properties['Recruiter Name']?.title?.[0]?.plain_text ||
					'Unknown';
				const jobRelations = recruiter.properties['Open Jobs']?.relation || [];

				const jobs = await Promise.all(
					jobRelations.map(async rel => {
						const job = await notion.pages.retrieve({ page_id: rel.id });
						return {
							id: job.id,
							title:
								job.properties['Job Name']?.rich_text?.[0]?.plain_text ||
								'Untitled Job',
							jobId: job.properties['Job Id']?.title?.[0]?.plain_text || '',
							companyName:
								job.properties['Company Name']?.rich_text?.[0]?.plain_text ||
								'',
						};
					})
				);

				return {
					recruiterId: recruiter.id,
					name: recruiterName,
					jobs,
				};
			})
		);

		res.json(result);
	} catch (err) {
		console.error('Error fetching board data:', err);
		res.status(500).json({ error: 'Failed to load board data' });
	}
}

export async function reassignJobToRecruiterById(req, res) {
	const { jobId, toRecruiterId } = req.body;

	try {
		const recruitersWithJob = await notion.databases.query({
			database_id: RECRUITER_DATABASE_ID,
			filter: {
				property: 'Open Jobs',
				relation: {
					contains: jobId,
				},
			},
		});

		for (const recruiter of recruitersWithJob.results) {
			const current = recruiter.properties['Open Jobs'].relation
				.filter(rel => rel.id !== jobId)
				.map(rel => ({ id: rel.id }));

			await notion.pages.update({
				page_id: recruiter.id,
				properties: {
					'Open Jobs': { relation: current },
				},
			});
		}

		const target = await notion.pages.retrieve({ page_id: toRecruiterId });
		const existing = target.properties['Open Jobs'].relation.map(rel => ({
			id: rel.id,
		}));

		await notion.pages.update({
			page_id: toRecruiterId,
			properties: {
				'Open Jobs': {
					relation: [...existing, { id: jobId }],
				},
			},
		});

		res.status(200).json({ success: true });
	} catch (err) {
		console.error('Reassignment error:', err);
		res.status(500).json({ error: 'Failed to reassign job' });
	}
}
