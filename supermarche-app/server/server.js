const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Connexion à la base
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');

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
    const response = await pool.query('SELECT * FROM produits');
    console.log("[DEBUG] Produits récupérés:", response.rows);
    res.status(200).json(response.rows);
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



app.delete('/api/user_cart/delete', async (req, res) => {
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


app.post("/api/cart/create-product", async (req, res) => {
  const { name, rayon_id } = req.body;

  // Validation des champs
  if (!name || !rayon_id) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  try {
    // Insertion dans la base de données
    const result = await pool.query(
        "INSERT INTO produits (name, rayon_id) VALUES ($1, $2)",
        [name, rayon_id]
    );

    // Réponse avec le produit créé
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création du produit :", error);

    // Gestion des erreurs PostgreSQL
    if (error.code === "23505") {
      res.status(400).json({ error: "Un produit avec ce nom existe déjà." });
    } else {
      res.status(500).json({ error: "Erreur serveur, veuillez réessayer plus tard." });
    }
  }
});

app.post("/api/create-store", async (req, res) => {
  const { name, address, sections } = req.body;

  // Log de debug pour voir la requête reçue
  console.log("[DEBUG] Requête reçue pour création magasin :", JSON.stringify(req.body, null, 2));

  // Vérifier que sections contient des données valides
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return res.status(400).json({ error: "Aucune section valide fournie." });
  }

  // Vérifier que chaque section contient des valeurs valides
  const invalidSections = sections.filter((section) =>
      !section.grid_position || !section.category_name
  );

  if (invalidSections.length > 0) {
    console.log("[DEBUG] Sections invalides :", invalidSections);
    return res.status(400).json({ error: "Certaines sections ont des données invalides." });
  }

  try {
    // Créer le magasin dans la table magasin
    const result = await pool.query(
        "INSERT INTO magasin (name, address) VALUES ($1, $2) RETURNING magasin_id",
        [name, address]
    );
    const magasinId = result.rows[0].magasin_id;
    console.log("[DEBUG] Magasin inséré, id:", magasinId);

    // Créer les sections dans la table magasin_sections
    const insertSectionsPromises = sections.map((section) => {
        if (section.rayon_id !== undefined && section.rayon_id !== null) {
            return pool.query(
                "INSERT INTO magasin_sections (magasin_id, grid_position, category_name, rayon_id) VALUES ($1, $2, $3, $4)",
                [magasinId, section.grid_position, section.category_name, section.rayon_id]
            );
        } else {
            return pool.query(
                "INSERT INTO magasin_sections (magasin_id, grid_position, category_name) VALUES ($1, $2, $3)",
                [magasinId, section.grid_position, section.category_name]
            );
        }
    });

    // Attendre que toutes les sections soient insérées
    await Promise.all(insertSectionsPromises);
    console.log("[DEBUG] Sections insérées pour magasin:", magasinId);

    res.status(201).json({ magasinId, name, address, sections });
  } catch (err) {
    console.error("[ERREUR] lors de la création du magasin ou des sections:", err);
    res.status(500).json({ error: "Erreur lors de la création du magasin ou des sections.", details: err.message });
  }
});



app.get("/api/stores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM magasin");
    res.json(result.rows);  // Renvoyer tous les magasins
  } catch (err) {
    console.error("Erreur lors de la récupération des magasins:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des magasins." });
  }
});

app.get("/api/store/:id", async (req, res) => {
  const { id } = req.params;

  // Vérifier que l'ID est valide
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "ID du magasin invalide" });
  }

  try {
    console.log("[DEBUG] Récupération du magasin ID:", id);
    const result = await pool.query(
        `SELECT m.name, m.address, s.section_id, s.grid_position, s.category_name, s.rayon_id
         FROM magasin m
                JOIN magasin_sections s ON m.magasin_id = s.magasin_id
         WHERE m.magasin_id = $1`,
        [id]
    );

    console.log("[DEBUG] Résultat de la requête:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Magasin non trouvé" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des sections du magasin:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des sections du magasin." });
  }
});

// Suppression d'un magasin (admin)
app.delete('/api/store/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer les sections associées
    await pool.query('DELETE FROM magasin_sections WHERE magasin_id = $1', [id]);
    // Supprimer le magasin
    await pool.query('DELETE FROM magasin WHERE magasin_id = $1', [id]);
    res.status(200).json({ message: 'Magasin supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la suppression du magasin:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression du magasin.' });
  }
});

// Routes
app.use('/api', authRoutes);
app.use('/api/cart', cartRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Une erreur est survenue',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Gestion des routes non trouvées
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
