const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('<h1>🏚️ Хлам Хаб работает!</h1><p>Скоро тут будет рулетка со скинами CS2.</p>');
});

app.listen(PORT, () => {
    console.log('✅ Сервер запущен на порту ' + PORT);
});
