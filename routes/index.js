const express = require('express');
const { db } = require('../database');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/user/profile');
    } else {
        res.render('login', { error: null });
    }
});

router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error Verificando existencia do email:', error);
            return res.status(500).send('Server Error');
        }

        if (results.length > 0) {
            return res.render('register', { error: 'Email ja registrado' });
        }

        db.query('INSERT INTO users SET ?', { name, email, password }, (error, result) => {
            if (error) {
                console.error('Error registering new user:', error);
                return res.status(500).send('Server Error');
            }
            console.log('Criação de novo usuario bem sucedida');
            res.redirect('/');
        });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
        if (error) {
            console.error('Error Verifique suas credenciais:', error);
            return res.status(500).send('Server Error');
        }

        if (results.length > 0) {
            req.session.user = results[0];
            res.redirect('/user/profile');
        } else {
            res.render('login', { error: 'Credenciais inválidas' });
        }
    });
});

router.get('/user/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user });
    } else {
        res.redirect('/');
    }
});

router.get('/users', (req, res) => {
    if (req.session.user) {
        db.query('SELECT * FROM users', (error, results) => {
            if (error) {
                console.error('Error fetching users:', error);
                return res.status(500).send('Server Error');
            }
            res.render('users', { users: results });
        });
    } else {
        res.redirect('/');
    }
});

router.post('/delete-user', (req, res) => {
    if (req.session.user) {
        const userEmail = req.body.email;
        db.query('DELETE FROM users WHERE email = ?', [userEmail], (error, result) => {
            if (error) {
                console.error('Error deleting user:', error);
                return res.status(500).send('Server Error');
            }
            // Verificar se o usuário excluído é o usuário logado
            if (req.session.user.email === userEmail) {
                req.session.destroy(err => {
                    if (err) {
                        console.error('Erro na distruiçao da sessão:', err);
                    }
                    res.clearCookie('connect.sid');
                    res.redirect('/');
                });
            } else {
                res.redirect('/users');
            }
        });
    } else {
        res.redirect('/');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro na distruiçao da sessão:', err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = { router };