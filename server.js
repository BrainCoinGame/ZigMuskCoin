import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import WebSocket from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

let points = 0;
let level = 1;
let energy = 100;
let nextLevelProgress = 0;
const maxEnergy = 100;
const energyCostPerClick = 5; // Расход энергии за один клик

// Функция для расчета прогресса к следующему уровню
const calculateNextLevelProgress = () => {
  return (points / (100 + 50 * (level - 1))) * 100;
};

// Получение состояния пользователя
app.get('/api/user', (req, res) => {
  res.json({ points, level, energy, nextLevelProgress });
});

// Обработчик клика
app.post('/api/click', (req, res) => {
  if (energy < energyCostPerClick) {
    return res.status(400).json({ message: 'Недостаточно энергии!' });
  }

  points += 1;
  energy -= energyCostPerClick;
  nextLevelProgress = calculateNextLevelProgress();

  if (points >= 100 + 50 * (level - 1)) {
    level += 1;
    points = 0;
    nextLevelProgress = 0;
  }

  res.json({ points, level, energy, nextLevelProgress });
});

// Восстановление энергии
app.post('/api/recharge', (req, res) => {
  energy = maxEnergy;
  res.json({ message: 'Энергия восстановлена!', energy });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});
// Пути к SSL-сертификатам
const server = https.createServer({
  cert: fs.readFileSync('path/to/certificate.crt'),  // Путь к вашему SSL-сертификату
  key: fs.readFileSync('path/to/private.key'),       // Путь к вашему приватному ключу
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  ws.send('Connected');
});

// Запуск сервера на порту 443 (для HTTPS)
server.listen(443, () => {
  console.log('Secure WebSocket server running on wss://localhost:443');
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
