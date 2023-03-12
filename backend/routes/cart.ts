import { Request, Response, Router } from 'express';
import promisePool from '../plugins/mysql';

import { Validator } from 'express-json-validator-middleware';
const { validate } = new Validator({});
import S from 'fluent-json-schema'

const router = Router();

router.get('/cart', async (req: Request, res: Response) => {//get cart for a specific user
    try {
        const [rows,fields] = await promisePool.query('SELECT product_id, quantity FROM cart WHERE user_id = ?', req.body.userId);
        res.send(rows);
    } catch (error) {
        res.status(500)
        res.send({Error: 500})
    }
});

router.post('/cart', validate({//add a row in cart or update quantity if product is already present for a specific user
    body: S.object()
        .prop('userId', S.number()).required()
        .prop('productId', S.number()).required()
        .valueOf(),
    }), async (req: Request, res: Response) => {
    try {
        const [rows,fields] = await promisePool.query('SELECT * FROM cart WHERE product_id = ? AND user_id = ?', [req.body.productId, req.body.userId]);
        if (rows.length === 0) {
            await promisePool.query('INSERT INTO cart (product_id, quantity, user_id) VALUES (?, 1, ?)', [req.body.productId, req.body.userId]);
        }else{            
            const newQuantity = rows[0].quantity + 1;
            await promisePool.query('UPDATE cart SET quantity = ? WHERE product_id = ? AND user_id = ?', [newQuantity, req.body.productId, req.body.userId]);
        }
        res.json({ post: true });
    } catch (error) {
        res.status(500)
        res.send({Error: 500})
    }
});

router.delete('/cart', async (req: Request, res: Response) => {//delete a row in cart for a specific user
    try {
        await promisePool.query('DELETE FROM cart WHERE product_id = ? AND user_id = ?', [req.body.productId, req.body.userId]);
        res.json({ delete: true });
    } catch (error) {
        res.status(500)
        res.send({Error: 500})
    }
});

export default router;