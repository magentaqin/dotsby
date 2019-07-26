import express from 'express';
import render from './render';

const PORT = 8080;
const app = express();

app.get('*', render);

app.listen(PORT);
