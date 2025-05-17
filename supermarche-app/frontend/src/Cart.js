import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddtoCart = () => {
    const [query, setQuery] = useState(""); // Stocke le nom du produit saisi
    const [products, setProducts] = useState([]); // Stocke les résultats des produits
    const [error, setError] = useState(null); // Stocke les erreurs
    const [userEmail, setUserEmail] = useState("");
    const [category, setCategory] = useState(""); // Catégorie
    const [categories, setCategories] = useState([]); // Pour stocker les catégories
    const [newProduct, setNewProduct] = useState({ name: "", rayon_id: "" }); // Stocke les données du nouveau produit
    const [toast, setToast] = useState(""); // Pour la notification toast
    const [toastType, setToastType] = useState("success"); // 'success' ou 'error'
    const navigate = useNavigate();
    const [userCart, setUserCart] = useState([]); // Liste de courses actuelle

    // Récupération des informations utilisateur
    useEffect(() => {
        const email = localStorage.getItem("userEmail");
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
                setCategories(response.data);
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
                setProducts(response.data);
            } catch (err) {
                setError('Erreur lors de la récupération des produits');
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    // Récupérer la liste de courses de l'utilisateur au chargement
    useEffect(() => {
        const fetchUserCart = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) return;
            try {
                const response = await axios.post('http://localhost:5000/api/cart/user', { user_id: userId });
                if (response.data.items) setUserCart(response.data.items);
            } catch (err) {
                // ignore
            }
        };
        fetchUserCart();
    }, []);

    const handleAddToCart = async (product) => {
        // Vérifier si le produit est déjà dans la liste de courses
        if (userCart.some(item => item.product_id === product.product_id)) {
            setToastType("error");
            setToast(`Ce produit est déjà dans votre liste de courses !`);
            setTimeout(() => setToast(""), 2500);
            return;
        }
        const userId = localStorage.getItem('user_id');
        const productData = {
            user_id: userId,
            created_at: new Date().toISOString(),
            product_id: product.product_id,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/cart/add-to-list', productData);
            if (response.status === 200) {
                setToastType("success");
                setToast(`Produit ajouté à la liste de courses: ${product.name}`);
                setTimeout(() => setToast(""), 2500);
                setUserCart([...userCart, { product_id: product.product_id, name: product.name }]);
            } else {
                setToastType("error");
                setError('Erreur lors de l\'ajout du produit à la liste.');
            }
        } catch (err) {
            setToastType("error");
            console.error('Erreur:', err);
            setError('Erreur lors de l\'ajout du produit.');
        }
    };

    const handleCreateProduct = async () => {
        if (!newProduct.name || !newProduct.rayon_id) {
            alert("Veuillez remplir tous les champs pour créer un produit.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/cart/create-product", newProduct);
            if (response.status === 201) {
                alert("Produit créé avec succès !");
                setProducts([...products, response.data]); // Ajout du nouveau produit à la liste
                setNewProduct({ name: "", rayon_id: "" }); // Réinitialisation du formulaire
            }
        } catch (error) {
            console.error("Erreur lors de la création du produit:", error);
            setError("Erreur lors de la création du produit.");
        }
    };
    const filteredProducts = products.filter((product) => {
        // Vérification si query est une chaîne valide
        const normalizedQuery = query ? query.toLowerCase() : "";

        // Vérification si product.name est une chaîne valide
        const normalizedProductName = product.name ? product.name.toLowerCase() : "";

        // Correspondance avec la requête de recherche
        const matchesQuery = normalizedQuery
            ? normalizedProductName.includes(normalizedQuery)
            : true;

        // Correspondance avec la catégorie
        const matchesCategory = category && category.rayon_id
            ? product.rayon_id === category.rayon_id
            : true;

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
            {/* Toast notification */}
            {toast && (
                <div style={{
                    position:'fixed', top:20, left:20, background:'rgba(255,255,255,0.95)',
                    color: toastType === 'success' ? '#27ae60' : '#e74c3c',
                    border: `2px solid ${toastType === 'success' ? '#27ae60' : '#e74c3c'}`,
                    padding:'1rem 2rem', borderRadius:8, zIndex:1000, fontWeight:'bold',
                    boxShadow:'0 2px 8px #0003', minWidth:260
                }}>
                    {toast}
                </div>
            )}
            <h1 className="text-3xl font-bold ml-20 mb-10 mt-10">Ajouter à la liste de courses</h1>

            <div className="flex flex-wrap gap-6">
                {/* Colonne gauche : Création de produit */}
                <div className="flex-1 min-w-[200px] max-w-[250px] mt-60 ">
                    <h2 className="text-xl font-bold mb-4">Envie de rajouter un produit ? Faites le nous savoir !</h2>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Nom du produit"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="p-2 rounded-md border w-full border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <select
                            value={newProduct.rayon_id}
                            onChange={(e) => setNewProduct({ ...newProduct, rayon_id: e.target.value })}
                            className="p-2 rounded-md border w-full border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="">Sélectionnez une catégorie</option>
                            {categories.map((category) => (
                                <option key={category.rayon_id} value={category.rayon_id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleCreateProduct}
                            className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
                        >
                            Faire une demande
                        </button>
                    </div>
                </div>

                {/* Colonne droite : Recherche et résultats */}
                <div className="flex-1 min-w-[300px]">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Entrez un nom de produit"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="p-2 flex-1 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        <select
                            onChange={(e) => setCategory(categories.find(c => c.rayon_id === parseInt(e.target.value)))}
                            className="p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="">Toutes les catégories</option>
                            {categories.map((category) => (
                                <option key={category.rayon_id} value={category.rayon_id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    {filteredProducts.length > 0 ? (
                        <ul className="flex flex-wrap gap-6">
                            {filteredProducts.map((product) => {
                                const isInCart = userCart.some(item => item.product_id === product.product_id);
                                return (
                                    <li
                                        key={product.product_id}
                                        className="p-2 bg-gray-700 rounded-lg shadow-lg flex justify-between items-center w-full sm:w-[48%] lg:w-[30%]"
                                    >
                                        <div className="flex items-center">
                                            <span className="ml-2 text-lg font-semibold">{product.name}</span>
                                            {isInCart && (
                                                <span style={{
                                                    marginLeft:8,
                                                    background:'#fff',
                                                    color:'#27ae60',
                                                    border:'1px solid #27ae60',
                                                    borderRadius:6,
                                                    fontSize:'0.9rem',
                                                    fontWeight:'bold',
                                                    padding:'2px 8px'
                                                }}>
                                                    À prendre dans ce rayon
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="ml-4 px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-700"
                                            disabled={isInCart}
                                        >
                                            Ajouter
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-400">Aucun produit trouvé.</p>
                    )}
                </div>
            </div>
        </div>
    );

};

export default AddtoCart;
