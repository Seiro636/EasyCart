const pool = require('../db');

const authenticateUser = async (req, res, next) => {
    const userId = req.headers['user-id'];

    if (!userId) {
        return res.status(401).json({ error: 'Authentification requise' });
    }

    try {
        const result = await pool.query('SELECT * FROM utilisateurs WHERE user_id = $1', [userId]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        req.user = result.rows[0];
        next();
    } catch (err) {
        console.error('Erreur d\'authentification:', err);
        res.status(500).json({ error: 'Erreur d\'authentification' });
    }
};

module.exports = {
    authenticateUser
}; 