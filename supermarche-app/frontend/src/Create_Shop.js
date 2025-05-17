import React, { useState, useEffect } from "react";
import axios from "axios";

const ENTRY_LABEL = "Entrée";
const CASH_LABEL = "Caisse";

const GroceryGrid = () => {
    const [categories, setCategories] = useState([]); // Liste des catégories
    const [selectedCategory, setSelectedCategory] = useState(""); // Catégorie sélectionnée
    const [error, setError] = useState(""); // Message d'erreur
    const [storeName, setStoreName] = useState(""); // Nom du magasin
    const [storeAddress, setStoreAddress] = useState(""); // Adresse du magasin
    const [isEraseMode, setIsEraseMode] = useState(false); // Mode gomme activé ?
    const gridSize = 20; // Taille de la grille (20x20)

    // Récupération des catégories via l'API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/cart/rayon");
                console.log("Rayons reçus:", response.data);
                // Transformer les données pour avoir un accès plus facile aux rayons
                const categoriesMap = response.data.reduce((acc, cat) => {
                    acc[cat.name] = cat;
                    return acc;
                }, {});
                setCategories(categoriesMap);
            } catch (error) {
                console.error("Erreur lors de la récupération des rayons:", error);
                setError("Impossible de charger les catégories.");
            }
        };

        fetchCategories();
    }, []);

    // Fonction pour gérer la sélection de catégorie
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setIsEraseMode(false);
    };

    // Fonction utilitaire pour normaliser les noms de catégories
    const normalize = (str) => str && str.normalize('NFD').replace(/\u0300-\u036f/g, '').toLowerCase().replace(/[^a-z0-9]/gi, '');

    // Fonction pour gérer le clic sur une div
    const handleDivClick = (e) => {
        if (isEraseMode) {
            e.target.id = "";
            e.target.dataset.rayonId = ""; // Supprimer aussi le rayon_id
            e.target.style.backgroundColor = "white";
        } else if (selectedCategory) {
            if (selectedCategory === ENTRY_LABEL) {
                const gridCells = document.querySelectorAll('.grid-cell');
                let entryCount = 0;
                gridCells.forEach(cell => { if (cell.id === ENTRY_LABEL) entryCount++; });
                if (e.target.id !== ENTRY_LABEL && entryCount >= 3) {
                    alert("Vous ne pouvez placer que 3 entrées maximum.");
                    return;
                }
            }
            e.target.id = selectedCategory;
            // Stocker le rayon_id dans un attribut data
            if (selectedCategory !== ENTRY_LABEL && selectedCategory !== CASH_LABEL) {
                // Normalisation pour correspondance robuste
                const normCat = normalize(selectedCategory);
                let foundRayon = null;
                for (const key in categories) {
                    console.log('Comparaison', normCat, 'avec', normalize(key), '->', categories[key]);
                    if (normalize(key) === normCat) {
                        foundRayon = categories[key];
                        break;
                    }
                }
                console.log('selectedCategory:', selectedCategory, '-> rayon trouvé:', foundRayon);
                if (foundRayon) {
                    e.target.dataset.rayonId = foundRayon.rayon_id;
                    console.log('Rayon_id affecté:', foundRayon.rayon_id);
                } else {
                    e.target.dataset.rayonId = "";
                    console.warn('Aucun rayon_id trouvé pour', selectedCategory);
                }
            }
            e.target.style.backgroundColor = getCategoryColor(selectedCategory);
        } else {
            alert("Veuillez d'abord sélectionner une catégorie ou activer la gomme !");
        }
    };

    // Fonction pour associer une couleur à chaque catégorie
    const getCategoryColor = (category) => {
        const colors = {
            // Boucherie: "#FF6347", // SUPPRIMÉ
            Poissonnerie: "#1E90FF", // Bleu Océan
            Fruits: "#FFA07A", // Pêche
            Légumes: "#32CD32", // Vert Lime
            "Pains/Pâtisseries": "#D2B48C", // Beige Pain
            "Laits/Fromagerie": "#FFFACD", // Jaune Pâle
            Charcuteries: "#DC143C", // Rouge Cerise
            Surgelés: "#87CEEB", // Bleu Clair
            "Épicerie Salée": "#F4A460", // Sable
            "Épicerie Sucrée": "#FFD700", // Or
            Boissons: "#4682B4", // Bleu Acier
            Bébé: "#FFC0CB", // Rose
            "Hygiène/Beauté": "#FF69B4", // Rose Foncé
            Entretien: "#8B4513", // Marron
            Animalerie: "#CD853F", // Brun Clair
            Maison: "#708090", // Gris Ardoise
            [ENTRY_LABEL]: "#27ae60", // Vert pour Entrée
            [CASH_LABEL]: "#222", // Noir pour Caisse
        };
        return colors[category] || "white"; // Couleur par défaut : blanc
    };

    // Fonction pour créer le magasin
    const handleCreateStore = () => {
        const sections = [];
        const gridCells = document.querySelectorAll('.grid-cell');
        gridCells.forEach((cell, index) => {
            const category = cell.id;
            if (category) {
                const x = (index % gridSize) + 1;
                const y = Math.floor(index / gridSize) + 1;
                let rayon_id = null;
                
                if (category !== ENTRY_LABEL && category !== CASH_LABEL) {
                    // Récupérer le rayon_id depuis l'attribut data
                    rayon_id = cell.dataset.rayonId;
                    console.log(`Section ${category} à la position ${x},${y} a le rayon_id:`, rayon_id);
                }

                sections.push({
                    grid_position: `${x},${y}`,
                    category_name: category,
                    rayon_id: rayon_id ? parseInt(rayon_id) : null
                });
            }
        });

        // SUPPRIMER l'ajout automatique d'une section Boucherie
        // const hasBoucherie = sections.some(s => s.category_name === "Boucherie");
        // if (!hasBoucherie) {
        //     sections.push({
        //         grid_position: "1,1",
        //         category_name: "Boucherie",
        //         rayon_id: 1
        //     });
        //     console.log("Section Boucherie ajoutée automatiquement à la position 1,1");
        // }

        // Validation
        if (!storeName || !storeAddress) {
            alert("Veuillez remplir le nom et l'adresse du magasin.");
            return;
        }
        if (!Array.isArray(sections) || sections.length === 0) {
            alert("Veuillez placer au moins un rayon sur la grille.");
            return;
        }

        // Log des sections avant envoi
        console.log("Sections à envoyer:", sections);

        // Envoi au serveur
        axios.post("http://localhost:5000/api/create-store", {
            name: storeName,
            address: storeAddress,
            sections: sections,
        })
        .then(response => {
            console.log("Magasin créé :", response.data);
            alert("Magasin créé avec succès !");
        })
        .catch(error => {
            console.error("Erreur lors de la création du magasin:", error);
            alert("Erreur lors de la création du magasin.");
        });
    };

    // Fonction pour activer ou désactiver le mode gomme
    const toggleEraseMode = () => {
        setIsEraseMode(!isEraseMode);
        setSelectedCategory(""); // Désactive la catégorie sélectionnée lorsqu'on active la gomme
    };

    return (
        <div className=" flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {error && <p className="error text-white">{error}</p>}

            {/* Formulaire de création du magasin */}
            <div className="store-form bg-gray-800 p-8 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Création du Magasin</h3>
                <div className="mb-4">
                    <label className="text-white">Nom du magasin :</label>
                    <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="text-white">Adresse du magasin :</label>
                    <input
                        type="text"
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
                    />
                </div>
                <button onClick={handleCreateStore} className="bg-blue-600 text-white py-2 px-6 rounded-full w-full mt-4 hover:bg-blue-500">
                    Créer le magasin
                </button>
            </div>

            {/* Sélecteur de catégorie et bouton mode gomme */}
            <div className="controls  w-11/12 md:w-3/4 lg:w-1/2">
                <label htmlFor="category-select" className="text-white">Sélectionnez une catégorie :</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="w-full p-2 mt-2 rounded bg-gray-700 text-white"
                >
                    <option value="">-- Choisissez --</option>
                    <option value={ENTRY_LABEL}>Entrée</option>
                    <option value={CASH_LABEL}>Caisse</option>
                    {Object.keys(categories).map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <button
                    onClick={toggleEraseMode}
                    className={`mt-4 py-2 px-4 rounded-full w-full text-white ${isEraseMode ? 'bg-red-600' : 'bg-gray-700'}`}
                >
                    {isEraseMode ? "Mode Gomme Activé" : "Activer Mode Gomme"}
                </button>
            </div>

            {/* Grille des cellules */}
         <div className={"mb-56"}>
            <div className="grid grid-cols-20 ">
                {Array.from({ length: gridSize * gridSize }).map((_, index) => (
                    <div
                        key={index}
                        className="grid-cell w-7 h-6 "
                        onClick={handleDivClick}
                        style={{
                            backgroundColor: "white", // Couleur initiale
                        }}
                    ></div>
                ))}
            </div>
         </div>
        </div>
    );
};

export default GroceryGrid;
