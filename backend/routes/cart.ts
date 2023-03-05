import { Request, Response, Router } from 'express';

const router = Router();

router.get('/cart/:id', (req: Request, res: Response) => {
    res.send('Hello cart!');
});

router.post('/cart', (req: Request, res: Response) => {
    res.send('Hello cart!');
});

router.delete('/cart/:id', (req: Request, res: Response) => {
    res.send('Hello cart!');
});

export default router;