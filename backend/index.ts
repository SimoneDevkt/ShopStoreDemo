import dotenv from 'dotenv';
dotenv.config();//load env vars

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { ValidationError } from "express-json-validator-middleware";

import jtwMiddleware from './middleware/jwt'

import productRouter from './routes/product';
import cartRouter from './routes/cart';
import loginRouter from './routes/login';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

/**
 * Load all routes
 */
app.use('/', loginRouter);

app.use('/', productRouter);
app.use('/', jtwMiddleware, cartRouter);

/**
 * Error handler middleware for validation errors.
 */
app.use((error, request, response, next) => {
    // Check the error is a validation error
    if (error instanceof ValidationError) {// Handle the error
      response.status(400).send(error.validationErrors);
      next();
    } else {// Pass error on if not a validation error
      next(error);
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});