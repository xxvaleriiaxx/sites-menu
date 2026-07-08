const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'site_menu'
});

db.connect(err => {
    if (err) {
        console.error('Ошибка MySQL:', err);
    } else {
        console.log('MySQL успешно подключён');
    }
});

// Получить все сайты
app.get('/sites', (req, res) => {
    db.query('SELECT * FROM sites ORDER BY category', (err, results) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(results);
    });
});

// Добавить сайт
app.post('/sites', (req, res) => {
    const { name, url, category, icon } = req.body;
    if (!name || !url || !category || !icon) {
        return res.status(400).json({error: 'Все поля обязательны'});
    }

    db.query('INSERT INTO sites (name, url, category, icon) VALUES (?, ?, ?, ?)',
        [name, url, category, icon], (err) => {
            if (err) return res.status(500).json({error: err.message});
            res.json({message: 'Сайт добавлен'});
        });
});

// Редактировать сайт
app.put('/sites/:id', (req, res) => {
    const { name, url, category, icon } = req.body;
    const id = req.params.id;

    db.query('UPDATE sites SET name = ?, url = ?, category = ?, icon = ? WHERE id = ?',
        [name, url, category, icon, id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: err.message});
            }
            res.json({message: 'Сайт обновлён'});
        });
});

// Удалить сайт
app.delete('/sites/:id', (req, res) => {
    db.query('DELETE FROM sites WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({error: err.message});
        res.json({message: 'Сайт удалён'});
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});