import { Request, Response, Router } from 'express';

const router = Router();

router.get('/products', (req: Request, res: Response) => {
  res.send('Hello World!');
});

router.get('/product/:id', (req: Request, res: Response) => {
  res.send('Hello product!');
});

router.patch('/product/:id', (req: Request, res: Response) => {
    res.send('Hello product!');
});

router.delete('/product/:id', (req: Request, res: Response) => {
    res.send('Hello product!');
});

router.post('/product', (req: Request, res: Response) => {
    res.send('Hello product!');
});

export default router;