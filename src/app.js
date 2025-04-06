import api from './api/index.js';
import cors from "cors";
import express from 'express';
const app = express();

app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/api/v1', api);

export default app;