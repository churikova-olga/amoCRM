import express from 'express';
import {apiRoutes} from './routes/api';
import { Request } from "express";
import cors from "cors";


const app = express();
const port = 3000;


app.use('/api', apiRoutes);
app.use(cors<Request>());

app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});