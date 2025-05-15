// server.js
require('dotenv').config(); // Для загрузки переменных окружения
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Инициализация приложения
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройки CORS
const corsOptions = {
  origin: [
    'http://localhost:3000', // Для разработки
    'http://127.0.0.1:3000' // Альтернативный адрес
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Обработка предварительных OPTIONS-запросов
app.options('*', cors(corsOptions));

// Временная "база данных" пользователей
// В реальном проекте замените на подключение к настоящей БД
const users = [
  {
    id: 1,
    login: 'admin',
    // Пароль: "SaveCraft123" (захеширован с bcrypt)
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMy.MJMv6L4d9G6B9U9gZ1Jp27GFg7G/J6W',
    role: 'admin'
  }
];

// Проверка пользователя (заглушка - в реальном проекте подключите БД)
const findUserByLogin = async (login) => {
  return users.find(user => user.login === login);
};

// Генерация JWT токена
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key-32-chars-min', // В продакшене используйте .env
    { expiresIn: '1h' }
  );
};

// Маршрут авторизации
app.post('/api/auth', async (req, res) => {
  try {
    const { login, password } = req.body;

    // Валидация входных данных
    if (!login || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    // Поиск пользователя
    const user = await findUserByLogin(login);
    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Генерация токена
    const token = generateToken(user.id);

    // Успешный ответ
    res.status(200).json({
      token,
      user: {
        id: user.id,
        login: user.login,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Проверка аутентификации (middleware)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-32-chars-min', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Защищенный маршрут (пример)
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Доступ разрешен', user: req.user });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`CORS настроен для: ${corsOptions.origin.join(', ')}`);
});