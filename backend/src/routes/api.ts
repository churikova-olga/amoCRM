import express from 'express';


const router = express.Router();

router.get('/leads', (req, res) => {
    // запрос на данные
    res.send('result');
});

export const apiRoutes = router;
