import fs from 'fs';
import csv from 'csv-parser';
import { notion, NOTION_DATABASE_ID, RECRUITER_DATABASE_ID } from './notion.js';
import { findRecruiterRowByName, getNotAssignedRecruiterRow } from './utils.js';

function readCSV(filePath) {
	const rows = [];
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on('data', row => rows.push(row))
			.on('end', () => resolve(rows))
			.on('error', reject);
	});
}

async function findPageByJobId(jobId) {
	const response = await notion.databases.query({
		database_id: NOTION_DATABASE_ID,
		filter: {
			property: 'Job Id',
			title: { equals: jobId },
		},
	});
	return response.results[0];
}

async function mapRowToProperties(row) {
	return {
		'Job Id': { title: [{ text: { content: row['Job Id'] || '' } }] },
		'Company Name': {
			rich_text: [{ text: { content: row['Company Name'] || '' } }],
		},
		'Job Name': { rich_text: [{ text: { content: row['Job Name'] || '' } }] },
		'Job Status': {
			rich_text: [{ text: { content: row['Job Status'] || '' } }],
		},
		'Third Owner': {
			rich_text: [{ text: { content: row['Third Owner'] || '' } }],
		},
		'First Owner': {
			rich_text: [{ text: { content: row['First Owner'] || '' } }],
		},
	};
}

async function reassignJobToRecruiter(jobPageId, thirdOwnerName) {
	const recruitersWithJob = await notion.databases.query({
		database_id: RECRUITER_DATABASE_ID,
		filter: {
			property: 'Open Jobs',
			relation: { contains: jobPageId },
		},
	});

	for (const recruiter of recruitersWithJob.results) {
		const current = recruiter.properties['Open Jobs'].relation
			.filter(rel => rel.id !== jobPageId)
			.map(rel => ({ id: rel.id }));

		await notion.pages.update({
			page_id: recruiter.id,
			properties: { 'Open Jobs': { relation: current } },
		});
	}

	let target = null;

	if (thirdOwnerName && thirdOwnerName.trim() !== '') {
		target = await findRecruiterRowByName(
			notion,
			thirdOwnerName,
			RECRUITER_DATABASE_ID
		);
	}

	if (!target) {
		target = await getNotAssignedRecruiterRow(notion, RECRUITER_DATABASE_ID);
	}

	if (target) {
		const existing = target.properties['Open Jobs'].relation.map(rel => ({
			id: rel.id,
		}));

		if (!existing.find(r => r.id === jobPageId)) {
			await notion.pages.update({
				page_id: target.id,
				properties: {
					'Open Jobs': {
						relation: [...existing, { id: jobPageId }],
					},
				},
			});
		}
	}
}

export async function handleCsvUpload(req, res) {
	try {
		const csvRows = await readCSV(req.file.path);
		let updated = 0,
			created = 0;

		for (const row of csvRows) {
			const existingPage = await findPageByJobId(row['Job Id']);
			const props = await mapRowToProperties(row);
			let page;

			if (existingPage) {
				await notion.pages.update({
					page_id: existingPage.id,
					properties: props,
				});
				page = existingPage;
				updated++;
			} else {
				page = await notion.pages.create({
					parent: { database_id: NOTION_DATABASE_ID },
					properties: props,
				});
				created++;
			}

			if (page) {
				await reassignJobToRecruiter(page.id, row['Third Owner']);
			}
		}

		res.send(`✅ Sync complete. Updated: ${updated}, Created: ${created}`);
	} catch (err) {
		console.error(err);
		res.status(500).send('❌ Error processing file.');
	}
}
