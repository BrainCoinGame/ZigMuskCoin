import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let points = 0;
let level = 1;
let energy = 100;
let nextLevelProgress = 0;
const maxEnergy = 100;
const energyCostPerClick = 5; // Расход энергии за один клик

app.get('/api/user', (req, res) => {
  res.json({ points, level, energy, nextLevelProgress });
});

app.post('/api/click', (req, res) => {
  if (energy < energyCostPerClick) {
    return res.status(400).json({ message: 'Недостаточно энергии!' });
  }

  points += 1;
  energy -= energyCostPerClick;
  nextLevelProgress = (points / (100 + 50 * (level - 1))) * 100;

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

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
