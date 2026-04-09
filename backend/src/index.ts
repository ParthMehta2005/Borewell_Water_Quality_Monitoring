import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import borewellRouter from './routes/borewell';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', borewellRouter);

app.get('/', (_req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});