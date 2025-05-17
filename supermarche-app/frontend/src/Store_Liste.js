import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/api/stores");
                setStores(response.data);
                setError("");
            } catch (error) {
                console.error("Erreur lors de la récupération des magasins:", error);
                setError("Impossible de charger la liste des magasins.");
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    const handleDeleteStore = async (magasin_id) => {
        try {
            await axios.delete(`http://localhost:5000/api/store/${magasin_id}`);
            setStores(stores.filter(s => s.magasin_id !== magasin_id));
        } catch (err) {
            setError("Erreur lors de la suppression du magasin.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Chargement des magasins...</div>;
    }

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 8, padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h1 style={{ textAlign: 'center', color: '#222', marginBottom: '2rem' }}>Nos Magasins</h1>
            {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {stores.map((store) => (
                    <li key={store.magasin_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #eee' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{store.name}</div>
                            <div style={{ color: '#666', fontSize: '0.98rem' }}>{store.address}</div>
                        </div>
                        <div style={{display:'flex',gap:8}}>
                            <button
                                style={{ padding: '0.5rem 1.2rem', background: '#3498db', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => navigate(`/store/${store.magasin_id}`)}
                            >
                                Voir
                            </button>
                            {userRole === 'admin' && (
                                confirmDelete === store.magasin_id ? (
                                    <button
                                        style={{ padding: '0.5rem 1.2rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}
                                        onClick={() => handleDeleteStore(store.magasin_id)}
                                    >
                                        Confirmer ?
                                    </button>
                                ) : (
                                    <button
                                        style={{ padding: '0.5rem 1.2rem', background: '#fff', color: '#e74c3c', border: '2px solid #e74c3c', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' }}
                                        onClick={() => setConfirmDelete(store.magasin_id)}
                                    >
                                        Supprimer
                                    </button>
                                )
                            )}
                        </div>
                    </li>
                ))}
                {stores.length === 0 && !error && (
                    <li style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                        Aucun magasin disponible pour le moment.
                    </li>
                )}
            </ul>
        </div>
    );
};

export default StoreList;
