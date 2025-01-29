import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const AddtoCart = () => {
    const [query, setQuery] = useState(""); // Stocke le nom du produit saisi
    const [products, setProducts] = useState([]); // Stocke les résultats des produits
    const [error, setError] = useState(null); // Stocke les erreurs
    const [userEmail, setUserEmail] = useState("");
    const [category, setCategory] = useState(""); // Catégorie
    const [categories, setCategories] = useState([]); // Pour stocker les catégorie
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    // Récupération des informations utilisateur
    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        setUserId(userId);
        setUserEmail(email);

        if (!email) {
            // Redirection si l'utilisateur n'est pas connecté
            setTimeout(() => {
                navigate("/Home");
            }, 2000);
        }
    }, [navigate]);

    // Récupération des catégories depuis l'API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/cart/rayon");
                console.log(response.data);
                setCategories(response.data); // Extract rayon names

            } catch (error) {
                console.error("Erreur lors de la récupération des rayons:", error);
                setError("Impossible de charger les catégories.");
            }
        };

        fetchCategories();
    }, []);




    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/cart/produit");

                console.log('data',response.data);
                setProducts(response.data); // Stocke les produits dans l'état
            } catch (err) {
                setError('Erreur lors de la récupération des produits');
                console.error(err);
            }
        };

        fetchProducts();
    }, []); // L'effet se déclenche une seule fois au montage du composant



    const handleAddToCart = async (product) => {
        // Récupérer l'ID de l'utilisateur (tu peux le récupérer de l'état ou d'un contexte global)
        const userId = localStorage.getItem('user_id');

        // Crée un objet avec les informations nécessaires
        const productData = {
            user_id: userId,
            created_at: new Date().toISOString(), // L'heure actuelle au format ISO
            product_id: product.product_id, // L'ID du produit sélectionné
        };
        console.log('productData',productData);

        try {
            // Envoie la requête POST pour ajouter le produit à la liste de courses
            const response = await axios.post('http://localhost:5000/api/cart/add-to-list', productData);

            // Vérifie la réponse de l'API
            if (response.status === 200) {
                alert(`Produit ajouté à la liste de courses: ${product.name}`);
            } else {
                setError('Erreur lors de l\'ajout du produit à la liste.');
            }
        } catch (err) {
            console.error('Erreur:', err);
            setError('Erreur lors de l\'ajout du produit.');
        }
    };
    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const filteredProducts = products.filter((product) => {
        // Normalisation de la recherche et du nom du produit (suppression des accents et mise en minuscules)
        const normalizedQuery = removeAccents(query.toLowerCase());
        const normalizedProductName = removeAccents(product.name.toLowerCase());

        const matchesQuery = normalizedProductName.includes(normalizedQuery);

        // Vérifie si la catégorie est définie et correspond au rayon_id du produit
        const matchesCategory = category ? product.rayon_id === category.rayon_id : true;

        return matchesQuery && matchesCategory;
    });




    if (!userEmail) {
        return (
            <div className="flex items-center justify-center min-h-screen bg">
                <h2 className="text-2xl font-semibold text-red-700">
                    Vous devez vous connecter pour accéder à cette page
                </h2>
            </div>
        );
    }
    return (
        <div className="bg-gray-800 min-h-screen p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">Ajouter a la liste de course</h1>

            {/* Zone de recherche */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Entrez un nom de produit"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="p-2 flex-1 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                />
                <select onChange={(e) => setCategory(categories.find(c => c.rayon_id === parseInt(e.target.value)))} className={"p-2 rounded-md border w-full border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"}>
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                        <option key={category.rayon_id} value={category.rayon_id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Gestion des erreurs */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Résultats */}
            {filteredProducts.length > 0 ? (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">Résultats :</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
                        {filteredProducts.map((product) => (
                            <li
                                key={product.product_id}
                                className="p-2 bg-gray-700 rounded-lg shadow-lg hover:shadow-xl flex justify-between items-center"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={`/product_images/${product.name.replace(/\s+/g, '_')}.jpg`} // Remplace les espaces par des underscores
                                        alt={product.name}
                                        className="h-24 w-24 object-cover border rounded-md mb-3"
                                        onError={(e) => e.target.src = 'fallback-image-url'} // Image de remplacement en cas d'erreur
                                    />
                                    <h3 className="text-lg font-bold mb-2 ml-4">
                                        {product.name}
                                    </h3>
                                </div>

                                <button
                                    className="mt-3 px-3 py-2 bg-green-600 rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500 xl:mr-5 lg:mr- md:mr-5 sm:mr-5"
                                    onClick={() => handleAddToCart(product)} // Appel de la fonction lors du clic
                                >
                                    ✔
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-400">Aucun produit trouvé.</p>
            )}
        </div>
    );
};

export default AddtoCart;
