import express from 'express';
import {apiRoutes} from './routes/api';

import cors from "cors";


const app = express();
const port = 3000;
const options = {
    origin: 'http://localhost:8080',
}
app.use(cors(options));

app.use('/api', apiRoutes);


app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
});