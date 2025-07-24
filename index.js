// FILE: index.js
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import boardRoutes from './routes/board.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use('/upload', upload.single('file'), uploadRoutes);
app.use('/board', boardRoutes);
app.use(cors({ origin: 'http://localhost:5173' }));

app.get('/', (req, res) => {
	res.send(`
    <html><body>
      <h2>Upload Open Jobs CSV</h2>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept=".csv" required />
        <button type="submit">Upload and Sync</button>
      </form>
    </body></html>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
