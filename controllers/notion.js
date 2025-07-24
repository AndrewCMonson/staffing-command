// FILE: controllers/notion.js
import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
dotenv.config();

export const notion = new Client({ auth: process.env.NOTION_API_KEY });
export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
export const RECRUITER_DATABASE_ID = process.env.RECRUITER_DATABASE_ID;
