import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const ENTRY_LABEL = "Entrée";
const CASH_LABEL = "Caisse";

const StoreDetails = () => {
    const [store, setStore] = useState(null);
    const [sections, setSections] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showPath, setShowPath] = useState(false);
    const [path, setPath] = useState([]);
    const [userRayons, setUserRayons] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allRayons, setAllRayons] = useState([]);
    const [shoppingMode, setShoppingMode] = useState(false);
    const [shoppingStep, setShoppingStep] = useState(0);
    const [shoppingOrder, setShoppingOrder] = useState([]);
    const [checkedByRayon, setCheckedByRayon] = useState({}); // { [step]: [product_id, ...] }

    // Récupérer la liste de courses de l'utilisateur
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        axios.post("http://localhost:5000/api/cart/user", { user_id: userId })
            .then(res => {
                if (res.data.items) {
                    setUserRayons(res.data.items); // on stocke tous les items, pas juste le nom
                }
            })
            .catch(() => setUserRayons([]));
    }, []);

    // Récupérer la liste de tous les produits
    useEffect(() => {
        axios.post("http://localhost:5000/api/cart/produit")
            .then(res => {
                if (res.data) setAllProducts(res.data);
            })
            .catch(() => setAllProducts([]));
    }, []);

    // Récupérer la liste de tous les rayons
    useEffect(() => {
        axios.get("http://localhost:5000/api/cart/rayon")
            .then(res => {
                if (res.data) setAllRayons(res.data);
            })
            .catch(() => setAllRayons([]));
    }, []);

    useEffect(() => {
        const fetchStoreDetails = async () => {
            try {
                setLoading(true);
                const path = window.location.pathname;
                const id = path.split("/").pop();

                if (!id || isNaN(id)) {
                    setError("ID du magasin invalide");
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/store/${id}`);
                const storeData = response.data;

                setStore({
                    name: storeData[0]?.name,
                    address: storeData[0]?.address,
                });

                setSections(storeData);
                setError("");

                if (response.data.role) {
                    localStorage.setItem('userRole', response.data.role);
                } else {
                    localStorage.removeItem('userRole');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du magasin:", error);
                setError("Impossible de charger les informations du magasin.");
            } finally {
                setLoading(false);
            }
        };

        fetchStoreDetails();
    }, []);

    // --- Algorithme pour trouver le chemin optimal ---
    const computePath = () => {
        const entries = sections.filter(s => s.category_name && s.category_name.trim().toLowerCase() === ENTRY_LABEL.toLowerCase());
        const cashes = sections.filter(s => s.category_name && s.category_name.trim().toLowerCase() === CASH_LABEL.toLowerCase());

        // LOGS DEBUG
        console.log('--- DEBUG CHEMIN ---');
        console.log('sections:', sections.map(s => ({cat: s.category_name, rayon_id: s.rayon_id})));
        console.log('userRayons:', userRayons);
        console.log('allProducts:', allProducts);
        console.log('allRayons:', allRayons);
        console.log('sections (détail):', sections);

        // 1. Récupérer tous les rayon_id des produits du panier
        const rayonIds = Array.from(new Set(
            userRayons
                .map(item => {
                    const prod = allProducts.find(p => p.product_id === item.product_id);
                    console.log('Produit trouvé pour item:', item, '=>', prod);
                    return prod ? prod.rayon_id : null;
                })
                .filter(Boolean)
        ));
        console.log('rayonIds à visiter:', rayonIds);

        // 2. Pour chaque rayon_id, trouver la section correspondante sur la grille
        const rayons = rayonIds
            .map(rid => {
                const found = sections.find(s => {
                    console.log('Comparaison rayon_id:', s.rayon_id, 'avec', rid, 'pour section:', s);
                    return s.rayon_id === rid;
                });
                console.log('Pour rayon_id', rid, 'section trouvée:', found);
                return found;
            })
            .filter(Boolean);

        console.log('entries trouvées:', entries);
        console.log('cashes trouvées:', cashes);
        console.log('rayons trouvés:', rayons);

        if (!entries.length || !cashes.length || !rayons.length) {
            alert("Il faut au moins une entrée, une caisse et un rayon à visiter.");
            return;
        }

        // 4. Départ = première entrée, arrivée = caisse la plus proche du dernier rayon
        const start = getXY(entries[0].grid_position);
        const endCandidates = cashes.map(c => getXY(c.grid_position));
        const points = rayons.map(r => ({ ...getXY(r.grid_position), label: r.category_name }));

        // 5. Ordre optimal (greedy: plus proche voisin)
        let order = [];
        let current = start;
        let toVisit = [...points];
        while (toVisit.length) {
            let minIdx = 0;
            let minDist = manhattan(current, toVisit[0]);
            for (let i = 1; i < toVisit.length; i++) {
                const d = manhattan(current, toVisit[i]);
                if (d < minDist) { minDist = d; minIdx = i; }
            }
            order.push(toVisit[minIdx]);
            current = toVisit[minIdx];
            toVisit.splice(minIdx, 1);
        }
        // Aller à la caisse la plus proche
        let minCashIdx = 0;
        let minCashDist = manhattan(current, endCandidates[0]);
        for (let i = 1; i < endCandidates.length; i++) {
            const d = manhattan(current, endCandidates[i]);
            if (d < minCashDist) { minCashDist = d; minCashIdx = i; }
        }
        const end = endCandidates[minCashIdx];

        // 6. Chemin complet : entrée -> rayons (ordre) -> caisse
        setPath([start, ...order, end]);
        setShowPath(true);
        // Préparer l'ordre des rayons pour le mode courses (sans entrée ni caisse)
        setShoppingOrder(order);
        setShoppingStep(0);
        setShoppingMode(false); // Réinitialise le mode courses
    };

    // Utilitaires
    function getXY(gridPosition) {
        let pos = gridPosition;
        if (Array.isArray(pos)) pos = pos.join(',');
        else if (typeof pos === 'number') {
            pos = pos.toString();
            if (!pos.includes(',')) pos = pos.split('').join(',');
        } else if (typeof pos !== 'string') pos = String(pos);
        const [x, y] = pos.split(',').map(Number);
        return { x, y };
    }
    function manhattan(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    // Fonction pour supprimer les produits cochés de la liste de courses
    const removeCheckedProductsFromCart = async (productIds) => {
        const userId = localStorage.getItem('user_id');
        for (const productId of productIds) {
            try {
                await axios.delete('http://localhost:5000/api/user_cart/delete', {
                    data: { user_id: userId, product_id: productId },
                });
            } catch (err) {
                // ignore erreur suppression
            }
        }
        // Mettre à jour localement userRayons
        setUserRayons(prev => prev.filter(item => !productIds.includes(item.product_id)));
    };

    // --- UI du mode courses ---
    const renderShoppingMode = () => {
        if (!shoppingOrder.length) return null;
        if (shoppingStep >= shoppingOrder.length) {
            return (
                <div style={{marginTop:30, fontWeight:'bold', fontSize:'1.3rem', color:'#27ae60'}}>Courses terminées ! 🎉</div>
            );
        }
        const rayon = shoppingOrder[shoppingStep];
        // Trouver les produits à prendre dans ce rayon
        const productsInRayon = userRayons
            .map(item => allProducts.find(p => p.product_id === item.product_id))
            .filter(p => p && p.rayon_id === sections.find(s => s.category_name === rayon.label)?.rayon_id);

        // Liste des produits cochés pour ce rayon
        const checkedProducts = checkedByRayon[shoppingStep] || [];

        const handleCheck = (productId) => {
            setCheckedByRayon(prev => {
                const current = prev[shoppingStep] || [];
                return {
                    ...prev,
                    [shoppingStep]: current.includes(productId)
                        ? current.filter(id => id !== productId)
                        : [...current, productId]
                };
            });
        };

        const allChecked = productsInRayon.length > 0 && checkedProducts.length === productsInRayon.length;

        const handleValidateRayon = async () => {
            await removeCheckedProductsFromCart(checkedProducts);
            setShoppingStep(shoppingStep+1);
        };

        return (
            <div style={{marginTop:30, textAlign:'center'}}>
                <h2 style={{fontSize:'1.2rem', marginBottom:10}}>Prochain rayon à visiter :</h2>
                <div style={{fontWeight:'bold', fontSize:'1.5rem', color:'#DC143C', marginBottom:10}}>{rayon.label}</div>
                {productsInRayon.length > 0 && (
                    <ul style={{margin:'0 auto 15px auto', display:'inline-block', textAlign:'left', background:'#fff', color:'#222', borderRadius:8, padding:'10px 20px', border:'1px solid #eee', minWidth:220}}>
                        {productsInRayon.map(prod => (
                            <li key={prod.product_id} style={{marginBottom:6, fontWeight:'bold', display:'flex', alignItems:'center'}}>
                                <input
                                    type="checkbox"
                                    checked={checkedProducts.includes(prod.product_id)}
                                    onChange={() => handleCheck(prod.product_id)}
                                    style={{marginRight:8}}
                                />
                                {prod.name}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={handleValidateRayon}
                    style={{background:'#27ae60', color:'#fff', border:'none', borderRadius:5, padding:'0.7rem 1.5rem', fontWeight:'bold', cursor: allChecked ? 'pointer' : 'not-allowed', opacity: allChecked || productsInRayon.length === 0 ? 1 : 0.5}}
                    disabled={productsInRayon.length > 0 && !allChecked}
                >
                    Valider le rayon
                </button>
                <div style={{marginTop:15, color:'#888'}}>({shoppingStep+1} / {shoppingOrder.length})</div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="store-details-container">
                <div className="loading-spinner">Chargement du magasin...</div>
            </div>
        );
    }

    // Pour surligner le chemin sur la grille
    function getPathIndex(x, y) {
        return path.findIndex(p => p.x === x && p.y === y);
    }

    return (
        <div className="store-details-container">
            {error && <div className="error-message">{error}</div>}
            
            {store && (
                <div className="store-details-content">
                    <div className="store-header">
                        <h1 className="store-title">{store.name}</h1>
                        <p className="store-address">
                            <i className="fas fa-map-marker-alt"></i> {store.address}
                        </p>
                    </div>
                    <button onClick={computePath} style={{marginBottom:20, background:'#3498db', color:'#fff', border:'none', borderRadius:5, padding:'0.7rem 1.5rem', fontWeight:'bold', cursor:'pointer'}}>Afficher le chemin optimal</button>
                    {showPath && !shoppingMode && (
                        <button onClick={() => setShoppingMode(true)} style={{marginBottom:20, marginLeft:10, background:'#f39c12', color:'#fff', border:'none', borderRadius:5, padding:'0.7rem 1.5rem', fontWeight:'bold', cursor:'pointer'}}>Lancer les courses</button>
                    )}
                    {shoppingMode && renderShoppingMode()}
                    <div className="store-layout">
                        <div className="store-grid-container">
                            <h2>Plan du magasin</h2>
                            <div className="grid grid-cols-20">
                                {Array.from({ length: 400 }).map((_, index) => {
                                    const x = (index % 20) + 1;
                                    const y = Math.floor(index / 20) + 1;
                                    const section = sections.find(s => {
                                        let gridPosition = s.grid_position;
                                        if (Array.isArray(gridPosition)) gridPosition = gridPosition.join(',');
                                        else if (typeof gridPosition === 'number') {
                                            gridPosition = gridPosition.toString();
                                            if (!gridPosition.includes(',')) gridPosition = gridPosition.split('').join(',');
                                        } else if (typeof gridPosition !== 'string') gridPosition = String(gridPosition);
                                        const [sx, sy] = gridPosition.split(',').map(Number);
                                        return sx === x && sy === y;
                                    });
                                    let cellContent = null;
                                    if (section) {
                                        if (section.category_name === ENTRY_LABEL) cellContent = <span className="section-label" style={{fontWeight:'bold',color:'#fff'}}>E</span>;
                                        else if (section.category_name === CASH_LABEL) cellContent = <span className="section-label" style={{fontWeight:'bold',color:'#fff'}}>C</span>;
                                        else cellContent = <span className="section-label">{section.category_name}</span>;
                                    }
                                    // Surlignage du chemin
                                    const pathIdx = showPath ? getPathIndex(x, y) : -1;
                                    return (
                                        <div
                                            key={index}
                                            className="grid-cell w-7 h-6"
                                            style={{
                                                backgroundColor: pathIdx >= 0 ? '#f9d423' : (section ? getCategoryColor(section.category_name) : 'white'),
                                                border: '1px solid #ccc',
                                                position: 'relative',
                                            }}
                                            title={section ? section.category_name : ''}
                                        >
                                            {cellContent}
                                            {pathIdx >= 0 && <span style={{position:'absolute',top:2,left:2,fontSize:'0.7rem',fontWeight:'bold',color:'#222'}}>{pathIdx+1}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="store-legend">
                            <h3>Légende des rayons</h3>
                            <div className="legend-grid">
                                {Object.entries(getCategoryColor()).map(([category, color]) => (
                                    <div key={category} className="legend-item">
                                        <div 
                                            className="legend-color" 
                                            style={{ backgroundColor: color }}
                                        >
                                            {category === ENTRY_LABEL && <span style={{color:'#fff',fontWeight:'bold'}}>E</span>}
                                            {category === CASH_LABEL && <span style={{color:'#fff',fontWeight:'bold'}}>C</span>}
                                        </div>
                                        <span className="legend-label">{category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const getCategoryColor = (category) => {
    const colors = {
        Poissonnerie: "#1E90FF",
        Fruits: "#FFA07A",
        Légumes: "#32CD32",
        "Pains/Pâtisseries": "#D2B48C",
        "Laits/Fromagerie": "#FFFACD",
        Charcuteries: "#DC143C",
        Surgelés: "#87CEEB",
        "Épicerie Salée": "#F4A460",
        "Épicerie Sucrée": "#FFD700",
        Boissons: "#4682B4",
        Bébé: "#FFC0CB",
        "Hygiène/Beauté": "#FF69B4",
        Entretien: "#8B4513",
        Animalerie: "#CD853F",
        Maison: "#708090",
        [ENTRY_LABEL]: "#27ae60",
        [CASH_LABEL]: "#222",
    };
    
    if (category) {
        return colors[category] || "#FFFFFF";
    }
    return colors;
};

export default StoreDetails;
