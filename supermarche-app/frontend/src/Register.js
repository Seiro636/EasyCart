    import React, {useState} from 'react';
    import './App.css';
    import {useNavigate} from "react-router-dom";


    function RegisterPage() {
        const [email, setEmail] = useState('');
        let [password, setPassword] = useState('');
        let [password2, setPassword2] = useState('');
        const [error, setError] = useState('');
        const navigate = useNavigate();
        const handleSubmit = async (e) => {
            e.preventDefault();
            // Simuler une connexion
            if (password !== password2) {
                setError('Les mots de passe ne correspondent pas');
                setPassword(''); // Réinitialiser le mot de passe
                setPassword2(''); // Réinitialiser le second mot de passe
            } else {
                try {
                    const response = await fetch('http://localhost:5000/api/register', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({email, password}),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        password = '';
                        password2 = '';
                        setEmail('');
                        alert(data.message); // Inscription réussie
                        navigate("/login");
                    } else {
                        setError(data.error); // Affiche l'erreur retournée
                    }
                } catch (err) {
                    console.error(err);
                    setError('Erreur de connexion au serveur');
                }
            }
        };
        return (
            <div className="flex items-center justify-center bg min-h-screen py">
                <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96 border border-gray-400">
                    <h2 className="text-2xl font-semibold text-center text-white mb-6">Inscription</h2>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-white">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 mt-2 bg border text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder=""
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-white">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 mt-2 border bg text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder=""
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password2" className="block text-white">Confirmation du mot de passe</label>
                            <input
                                type="password"
                                id="password2"
                                className="w-full px-4 py-2 mt-2 border bg text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder=""
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            S'inscrire
                        </button>

                    </form>
                    <div className=" mt-2 w-full py-1 px-1 flex row-auto">
                        <h2 className="text-white px-2 >">Deja inscrit ?</h2>
                        <a href="/login"
                           className=" text-blue-700 border-gray-300 font-bold ">Connexion</a>
                    </div>
                </div>
            </div>
        );
    }

    export default RegisterPage;
