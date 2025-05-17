const express = require('express');
const router = express.Router();
const pool = require('../db');

// Middleware de validation
const validateCartItem = (req, res, next) => {
    const { user_id, product_id } = req.body;
    
    if (!user_id || !product_id) {
        return res.status(400).json({ error: 'ID utilisateur et ID produit requis' });
    }
    
    next();
};

// Obtenir tous les rayons
router.get('/rayon', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM rayons');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des rayons:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des rayons' });
    }
});

// Obtenir tous les produits
router.get('/produit', async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM produits');
        res.status(200).json(response.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
});

// Ajouter un produit à la liste
router.post('/add-to-list', validateCartItem, async (req, res) => {
    const { user_id, created_at, product_id } = req.body;

    try {
        const query = `
            INSERT INTO listes_de_courses (user_id, created_at, product_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await pool.query(query, [user_id, created_at, product_id]);
        res.status(200).json({ 
            message: 'Produit ajouté à la liste',
            item: result.rows[0]
        });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du produit:', err);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
    }
});

// Obtenir la liste de courses d'un utilisateur
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT lc.product_id, lc.created_at, p.name, p.price
            FROM listes_de_courses lc
            JOIN produits p ON lc.product_id = p.product_id
            WHERE lc.user_id = $1
            ORDER BY lc.created_at DESC
        `;

        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(200).json({ 
                message: 'Votre liste de courses est vide',
                items: [] 
            });
        }

        res.status(200).json({
            items: result.rows.map(row => ({
                product_id: row.product_id,
                name: row.name,
                created_at: row.created_at,
                price: row.price
            }))
        });
    } catch (err) {
        console.error('Erreur lors de la récupération de la liste:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de la liste' });
    }
});

// Supprimer un produit de la liste
router.delete('/delete', validateCartItem, async (req, res) => {
    const { user_id, product_id } = req.body;

    try {
        const query = `
            DELETE FROM listes_de_courses 
            WHERE user_id = $1 AND product_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [user_id, product_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé dans la liste' });
        }

        res.status(200).json({ 
            message: 'Article supprimé avec succès',
            deletedItem: result.rows[0]
        });
    } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Mettre à jour le statut d'un produit
router.patch('/update', validateCartItem, async (req, res) => {
    const { user_id, product_id, is_taken } = req.body;

    if (typeof is_taken !== 'boolean') {
        return res.status(400).json({ error: 'Le statut doit être un booléen' });
    }

    try {
        const query = `
            UPDATE listes_de_courses 
            SET is_taken = $1 
            WHERE user_id = $2 AND product_id = $3
            RETURNING *
        `;
        const result = await pool.query(query, [is_taken, user_id, product_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produit non trouvé dans la liste' });
        }

        res.status(200).json({ 
            message: 'Statut mis à jour avec succès',
            updatedItem: result.rows[0]
        });
    } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

module.exports = router; 