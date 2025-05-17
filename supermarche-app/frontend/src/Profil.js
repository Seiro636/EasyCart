import React, { useState, useEffect } from 'react';

const Profil = () => {
    const [userEmail, setUserEmail] = useState('');
    const [created_at, setcreated_at] = useState('');
    const [userData, setUserData] = useState(null);
    const [userRole, setUserRole] = useState('user');

    useEffect(() => {
        // Ici vous pouvez récupérer les informations de l'utilisateur depuis localStorage ou une API
        const email = localStorage.getItem('userEmail');
        const created_at = localStorage.getItem('created_at'); // Ajouter un nom si nécessaire
        const role = localStorage.getItem('userRole') || 'user';
        setUserEmail(email);
        setcreated_at(created_at);
        setUserRole(role);
        console.log(email);
        console.log(created_at);
        // Si vous avez une API, vous pouvez la consulter ici pour charger des informations supplémentaires
        // Exemple avec fetch ou axios
        // fetch("/api/profil")
        //   .then(response => response.json())
        //   .then(data => setUserData(data));
    }, []);
    let email = localStorage.getItem('userEmail');
    if (email === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg">
                <h2 className="text-2xl font-semibold text-red-700">Vous devez vous connecter pour accéder à cette page</h2>
            </div>
        );
    }else {
        return (
            <div className="bg min-h-screen flex items-center justify-center">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
                    <h2 className="text-3xl font-semibold text-center text-white mb-6">Mon Profil</h2>

                    <div className="space-y-4">

                        <div className="flex  items-center">
                            <span className="font-medium text-white">Email :</span>
                            <span className="text-white ml-5">{userEmail}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-medium text-white">Date de Création :</span>
                            <span className="text-white ml-5">{created_at}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-medium text-white">Rôle :</span>
                            <span className="text-white ml-5">{userRole}</span>
                        </div>

                        {/* Si vous avez plus d'informations à afficher */}
                        {userData && (
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-600">Autre Information :</span>
                                <span className="text-gray-800">{userData.info}</span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <a href="/edit-profile" className="text-blue-600 hover:text-blue-800">Modifier mon profil</a>
                    </div>
                </div>
            </div>
        );
    }
};

export default Profil;
