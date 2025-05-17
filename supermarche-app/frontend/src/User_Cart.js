import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const User_Cart = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(null); // null: pas de confirmation, ou product_id pour confirmer la suppression
    const [confirmationMessage, setConfirmationMessage] = useState(""); // Message pour confirmation

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        const id = localStorage.getItem("user_id");
        setUserId(id);
        setUserEmail(email);
        if (!email) {
            navigate("/Home");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) return;

            try {
                const response = await axios.post("http://localhost:5000/api/cart/user", {
                    user_id: userId,
                });
                if (response.data.items) {
                    setCartItems(response.data.items);
                } else if (response.data.message) {
                    setError(response.data.message);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des articles :", err);
                setError("Erreur lors de la récupération de la liste.");
            }
        };

        fetchCart();
    }, [userId]);

    const toggleItemStatus = async (productId, isTaken) => {
        try {
            await axios.patch("http://localhost:5000/api/cart/update", {
                user_id: userId,
                product_id: productId,
                is_taken: !isTaken,
            });

            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.product_id === productId
                        ? { ...item, is_taken: !isTaken }
                        : item
                )
            );
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'état de l'article :", err);
            setError("Impossible de modifier l'état de cet article.");
        }
    };

    const handleDelete = async (productId) => {
        if (confirmDelete === productId) {
            try {
                await axios.delete("http://localhost:5000/api/user_cart/delete", {
                    data: { user_id: userId, product_id: productId },
                });

                setCartItems((prevItems) =>
                    prevItems.filter((item) => item.product_id !== productId)
                );
                setConfirmDelete(null);
            } catch (err) {
                console.error("Erreur lors de la suppression de l'article :", err);
                setError("Impossible de supprimer cet article. Veuillez réessayer.");
            }
        } else {
            setConfirmDelete(productId);
            setConfirmationMessage("Cliquez à nouveau pour confirmer la suppression.");
        }
    };

    const cancelDelete = () => {
        setConfirmDelete(null);
        setConfirmationMessage("");
    };

    return (
        <div className="bg-gray-800 min-h-screen p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">Votre liste de courses</h1>

            {/* Gestion des erreurs */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Zone de confirmation */}
            {confirmationMessage && (
                <div className="bg-yellow-100 text-yellow-700 p-2 rounded-md mb-4">
                    {confirmationMessage}
                </div>
            )}

            {/* Liste des articles */}
            {cartItems.length > 0 ? (
                <ul className="space-y-4">
                    {cartItems.map((item) => (
                        <li
                            key={item.product_id}
                            className={`p-4 bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all flex justify-between items-center ${
                                item.is_taken ? "opacity-50 line-through" : ""
                            }`}
                        >
                            <div className="flex items-center">
                                <h3 className="text-2xl  text-gray-200 ml-4">
                                    {item.name}
                                </h3>
                            </div>
                            <div className="flex items-center space-x-3">
                                {/* Bouton pour basculer le statut */}
                                <button
                                    onClick={() => toggleItemStatus(item.product_id, item.is_taken)}
                                    className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring ${
                                        item.is_taken
                                            ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                            : "bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                                    }`}
                                >
                                    {item.is_taken ? "Marquer comme non pris" : "Marquer comme pris"}
                                </button>
                                {/* Bouton de suppression */}
                                <button
                                    onClick={() => handleDelete(item.product_id)}
                                    className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-500"
                                >
                                    {confirmDelete === item.product_id ? "Confirmer" : "Supprimer"}
                                </button>
                                {/* Bouton pour annuler la suppression */}
                                {confirmDelete === item.product_id && (
                                    <button
                                        onClick={cancelDelete}
                                        className="ml-2 px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500"
                                    >
                                        Annuler
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">Votre liste de courses est vide.</p>
            )}
        </div>
    );
};

export default User_Cart;
