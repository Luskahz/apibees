import express from 'express'
import cron from 'node-cron'
import getCSV from './controllers/getCSV.js'

const app = express()
const port = 3000

app.use(express.json())

let isRunning = false;
let executionCount = 0;
let secondsUntilNext = 30;


setInterval(() => {
  if (secondsUntilNext > 0) {
    secondsUntilNext--;
    process.stdout.write(`⏳ Próxima execução em: ${secondsUntilNext}s   \r`);
  }
}, 1000);


cron.schedule('*/10 * * * * *', async () => {
  if (isRunning) return;

  executionCount++;
  console.log(`\n⏰ Execução #${executionCount} iniciada...`);

  isRunning = true;
  
  // Executa a tarefa
  await getCSV();

  console.log(`✅ Execução #${executionCount} finalizada`);


  secondsUntilNext = 300;
  isRunning = false;
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
