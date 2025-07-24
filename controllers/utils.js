// FILE: controllers/utils.js

export async function findRecruiterRowByName(
	notion,
	recruiterName,
	RECRUITER_DATABASE_ID
) {
	const response = await notion.databases.query({
		database_id: RECRUITER_DATABASE_ID,
		filter: {
			property: 'Recruiter Name',
			title: {
				equals: recruiterName,
			},
		},
	});
	return response.results[0];
}

export async function getNotAssignedRecruiterRow(
	notion,
	RECRUITER_DATABASE_ID
) {
	const response = await notion.databases.query({
		database_id: RECRUITER_DATABASE_ID,
		filter: {
			property: 'Recruiter Name',
			title: {
				equals: 'Not Assigned',
			},
		},
	});
	return response.results[0];
}
