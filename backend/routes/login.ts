import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();


import promisePool from '../plugins/mysql';//for mocking

router.post('/login', async (req: Request, res: Response) => {    
    //TODO: add login logic. now we use a mock with user 1
    const id = 1
    const name = 'Jhon Doe'
    try {
        const [rows,fields] = await promisePool.query('SELECT * FROM users WHERE id = ?', id);
        if(rows.length === 0){
            await promisePool.query('INSERT INTO users (id, name) VALUES (?, ?);', [id, name]);
        }
        const token = jwt.sign({ userId: 1 }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500)
        res.send({Error: 500})
    }
});

export default router;