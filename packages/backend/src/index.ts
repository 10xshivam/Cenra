import express from 'express'
import { prisma } from '@workspace/db';

const app = express();

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
})

app.listen(8000, () => {
    console.log('Server is running on Port 8000');
})