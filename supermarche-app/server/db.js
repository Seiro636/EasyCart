const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool(config.database);

// Vérification de la connexion
pool.on('error', (err) => {
    console.error('Erreur inattendue sur le client idle', err);
    process.exit(-1);
});

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Connexion à la base de données établie avec succès');
        client.release();
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
        process.exit(-1);
    }
};

testConnection();

module.exports = pool;
