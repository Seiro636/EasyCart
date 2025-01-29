const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Connexion à la base
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
// Route pour obtenir la valeur actuelle

app.post('/api/register', async (req, res) => {
  console.log('Requête reçue:', req.body);
  const { email, password } = req.body;


  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Erreur' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    let created_date = new Date();
    let updated_date = new Date();
    // Insérer le nouvel utilisateur dans la base de données
    await pool.query(
        'INSERT INTO utilisateurs (email, password_hash,created_at,updated_at) VALUES ($1, $2,$3,$4)',
        [email, hashedPassword,created_date,updated_date]
    );

    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


app.post('/api/login', async (req, res) => {
  const {email, password } = req.body;

  try {
    const user = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Utilisateur introuvable.' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Mot de passe incorrect.' });
    }

    // Ajout de la donnée `created_at` à la réponse
    const { email: userEmail, created_at, user_id } = user.rows[0];

    // Répondre avec le token et les informations utilisateur
    res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      userEmail,
      created_at,  // Envoie la date de création
      user_id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

app.post('/api/cart/rayon', async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM rayons');
    console.log(response.rows);
    res.status(200).json(response.rows); // Returns an array of objects like [{ rayon_name: 'Snacks' }]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});


app.post('/api/cart/produit', async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM produits ');
    res.status(200).json(response.rows); // Returns an array of objects like [{ name: 'Chips' }]

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

app.post('/api/cart/add-to-list', async (req, res) => {
  const {user_id, created_at, product_id } = req.body;

  try {
    // Vérifie que toutes les données nécessaires sont envoyées
    if (!user_id || !created_at || !product_id) {
      return res.status(400).json({ error: 'Toutes les informations sont nécessaires.' });
    }

    // Insérer le produit dans la base de données
    const query = `
      INSERT INTO listes_de_courses (user_id, created_at, product_id)
      VALUES ($1, $2, $3)
    `;
    await pool.query(query, [user_id, created_at, product_id]);

    res.status(200).json({ message: 'Produit ajouté à la liste.' });
  } catch (err) {
    console.error('Erreur lors de l\'ajout du produit:', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});


app.post('/api/cart/user', async (req, res) => {
  const { user_id } = req.body;

  try {
    // Vérifie que l'ID utilisateur est fourni
    if (!user_id) {
      return res.status(400).json({ error: 'L\'ID utilisateur est requis.' });
    }

    // Requête SQL pour récupérer les produits de la liste de courses
    const query = `
      SELECT lc.product_id, lc.created_at, p.name
      FROM listes_de_courses lc
             JOIN produits p ON lc.product_id = p.product_id
      WHERE lc.user_id = $1
      ORDER BY lc.created_at DESC
    `;

    const result = await pool.query(query, [user_id]);

    // Vérifie si la liste de courses est vide
    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'Votre liste de courses est vide.', items: [] });
    }

    // Structure de la réponse
    const cart = {
      items: result.rows.map((row) => ({
        product_id: row.product_id,
        name: row.name,
        created_at: row.created_at,
        price: row.price,
      })),
    };

    res.status(200).json(cart);
  } catch (err) {
    console.error('Erreur lors de la récupération de la liste de courses :', err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});



app.delete('/api/cart/delete', async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'Informations manquantes.' });
    }

    const query = `DELETE FROM listes_de_courses WHERE user_id = $1 AND product_id = $2`;
    await pool.query(query, [user_id, product_id]);

    res.status(200).json({ message: 'Article supprimé avec succès.' });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});


app.patch("/api/cart/update", async (req, res) => {
  const { user_id, product_id, is_taken } = req.body;

  try {
    await pool.query(
        "UPDATE listes_de_courses SET is_taken = $1 WHERE user_id = $2 AND product_id = $3",
        [is_taken, user_id, product_id]
    );
    res.status(200).json({ message: "Statut mis à jour avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du statut." });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Backend en écoute sur http://localhost:${port}`);
});
