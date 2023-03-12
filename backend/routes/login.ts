import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

import { Validator } from 'express-json-validator-middleware';
const { validate } = new Validator({});
import S from 'fluent-json-schema'

import promisePool from '../plugins/mysql';//for mocking

const router = Router();

router.post('/login', validate({
        body: S.object().additionalProperties(false).valueOf(),
        params: S.object().additionalProperties(false).valueOf(),
        query: S.object().additionalProperties(false).valueOf()
    }), async (req: Request, res: Response) => {    
    //TODO: add login logic. now we use a mock with user 1
    const id = 1
    const name = 'Jhon Doe'
    try {
        const [rows,fields] = await promisePool.query('SELECT * FROM users WHERE id = ?', id);
        if(rows.length === 0){
            await promisePool.query('INSERT INTO users (id, name) VALUES (?, ?);', [id, name]);
        }
        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {        
        res.status(500)
        res.send({Error: 500})
    }
});

export default router;