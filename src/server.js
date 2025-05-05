import express from 'express'
import cron from 'node-cron'
import getCSV from './controllers/getCSV.js'

const app = express()
const port = 3000

app.use(express.json())

let isRunning = false;

cron.schedule('*/10 * * * * *', async () => {
  if (isRunning) return;
  isRunning = true;

  console.log('⏰ Executando tarefa a cada 10 segundos...');
  await getBeesApiController();

  isRunning = false;
});