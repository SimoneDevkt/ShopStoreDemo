import { Request, Response, Router } from 'express';
import promisePool from '../plugins/mysql';

import { Validator } from 'express-json-validator-middleware';
const { validate } = new Validator({});

import S from 'fluent-json-schema'

const router = Router();

router.get('/product', validate({
        body: S.object().additionalProperties(false).valueOf(),
        params: S.object().additionalProperties(false).valueOf(),
        query: S.object().additionalProperties(false).valueOf()
    }), async (req: Request, res: Response) => {//return all products
    try {
        const [rows,fields] = await promisePool.query('SELECT * FROM product');
        res.send(rows);
    } catch (error) {
        console.log(error);
        
        res.status(500)
        res.send({Error: 500})
    }
});

router.get('/product/:id', validate({//return specific product by id
    params: S.object()
        .additionalProperties(false)
        .prop('id', S.string()).required()
        .valueOf(),
    body: S.object().additionalProperties(false).valueOf(),
    query: S.object()
        .additionalProperties(false)
        .valueOf()
  }), async (req: Request, res: Response) => {
    try {
        const [rows,fields] = await promisePool.query('SELECT * FROM product WHERE id = ?', req.params.id);
        res.send(rows[0]);
    } catch (error) {
        res.status(500)
        res.send({Error: 500})
    }
});

router.post('/product', validate({//insert a new product
    body: S.object()
        .additionalProperties(false)
        .prop('title', S.string()).required()
        .prop('description', S.string()).required()
        .prop('price', S.number()).required()
        .valueOf(),
    params: S.object().additionalProperties(false).valueOf(),
    query: S.object().additionalProperties(false).valueOf()
  }), async (req: Request, res: Response) => {
    const { title, description, price } = req.body;
    const values = [title, description, price];
    try {
        const [rows,fields] = await promisePool.query('INSERT INTO product (title, description, price) VALUES (?, ?, ?)', values);        
        res.send({Post: true});
    } catch (error) {
        res.status(500)        
        res.send({Error: 500})
    }
});

router.patch('/product/:id', validate({//update specific product by id
    body: S.object()
        .additionalProperties(false)
        .prop('title', S.string())
        .prop('description', S.string())
        .prop('price', S.number())
        .valueOf(),
    params: S.object()
        .prop('id', S.string()).required()
        .valueOf(),
    query: S.object().additionalProperties(false).valueOf()
  }), async (req: Request, res: Response) => {
    try {
        const [rows,fields] = await promisePool.query('UPDATE product SET ? WHERE id = ?', [req.body, req.params.id]);
        res.send({Patch: true});
    } catch (error) {
        res.status(500)        
        res.send({Error: 500})
    }
});

router.delete('/product/:id', validate({//delete specific product by id
    params: S.object()
        .prop('id', S.string()).required()
        .valueOf(),
    body: S.object().additionalProperties(false).valueOf(),
    query: S.object().additionalProperties(false).valueOf()
  }), async (req: Request, res: Response) => {
    try {
        const [rows,fields] = await promisePool.query('DELETE FROM product WHERE id = ?', req.params.id);
        res.send({Delete: true});
    } catch (error) {
        res.status(500)
        res.send({Error: 500})
    }
});

export default router;