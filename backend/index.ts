import express from 'express';

import productRouter from './routes/product';
import cartRouter from './routes/cart';
import loginRouter from './routes/login';

const app = express();
const port = 3000;

app.use('/', productRouter);
app.use('/', cartRouter);
app.use('/', loginRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});