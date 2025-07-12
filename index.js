import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/routes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
