const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Middleware de validation
const validateRegistration = (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: 'Format d\'email invalide' });
    }
    
    next();
};

// Route d'inscription
router.post('/register', validateRegistration, async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const created_date = new Date();
        const updated_date = new Date();

        await pool.query(
            'INSERT INTO utilisateurs (email, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4)',
            [email, hashedPassword, created_date, updated_date]
        );

        res.status(201).json({ message: 'Inscription réussie' });
    } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
        const user = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Utilisateur introuvable' });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!isMatch) {
            return res.status(400).json({ error: 'Mot de passe incorrect' });
        }

        const { email: userEmail, created_at, user_id } = user.rows[0];

        res.status(200).json({
            success: true,
            message: 'Connexion réussie',
            userEmail,
            created_at,
            user_id,
        });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

module.exports = router; 