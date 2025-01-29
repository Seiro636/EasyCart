import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';



function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        setEmail(email);

        if (email) {
            navigate("/Home");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
                try {
                    const response = await axios.post('http://localhost:5000/api/login', {
                        email,
                        password,

                    });
                    if (response.data.success) {
                        setSuccess(true);
                        console.log('Connexion réussie:', response.data.message);
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userEmail', email);
                        localStorage.setItem('user_id', response.data.user_id);
                        console.log('user_id',response.data.user_id);
                        const createdAt = new Date(response.data.created_at);
                        const formattedDate = `${createdAt.getDate()}/${String(createdAt.getMonth() + 1)}/${String(createdAt.getFullYear())}`;
                        localStorage.setItem('created_at', formattedDate);
                        console.log(response.data.created_at);

                        setTimeout(() => {
                            navigate("/Home");
                        }, 2000);
                    } else {
                        setError(response.data.error || 'Erreur lors de la connexion.');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Mot de passe Incorrect.');
                }
            };
            if (success) {
                return (
                    <div className="flex items-center justify-center min-h-screen bg">
                        <h2 className="text-2xl font-semibold text-green-700">Connexion réussie !</h2>
                    </div>
                );

            }

    return (
        <div className="flex items-center justify-center bg min-h-screen py">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-96 border border-gray-400">
                <h2 className="text-2xl font-semibold text-center text-white mb-6">Se connecter</h2>

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
                            className="w-full px-4 py-2 mt-2 border bg text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-green-700 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Se connecter
                    </button>

                </form>
                <div className=" mt-4 w-full  py-1 px-2">
                    <h2><a href="/register"
                           className=" text-blue-700 border-gray-300 font-bold ">Inscription</a></h2>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
