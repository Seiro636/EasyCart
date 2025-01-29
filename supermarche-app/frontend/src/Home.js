import React, {useState} from "react";
import { Link } from "react-router-dom";

const Home = () => {



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
            <div className="max-w-4xl text-center p-10 bg-gray-900 shadow-2xl rounded-2xl">
                <h1 className="text-5xl font-extrabold text-white mb-8">
                    Bienvenue dans votre nouvelle expérience de shopping
                </h1>
                <p className="text-lg text-gray-400 mb-10">
                    Découvrez une manière révolutionnaire de planifier et d'optimiser vos courses. Grâce à notre
                    magasin virtuel, naviguez dans les rayons en toute simplicité, créez votre liste de courses et trouvez le chemin le plus rapide pour récupérer tout ce dont vous avez besoin.
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-white mb-3">Visualisez le magasin</h2>
                        <p className="text-sm text-gray-400">
                            Explorez une représentation détaillée du magasin virtuel et planifiez votre parcours pas à pas.
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-white mb-3">Optimisez votre parcours</h2>
                        <p className="text-sm text-gray-400">
                            Laissez notre système calculer le meilleur itinéraire pour vous faire gagner du temps et de l'énergie.
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-white mb-3">Liste de courses personnalisée</h2>
                        <p className="text-sm text-gray-400">
                            Créez et gérez facilement votre liste de courses, avec des suggestions adaptées à vos besoins.
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-white mb-3">Interface interactive</h2>
                        <p className="text-sm text-gray-400">
                            Profitez d'une interface conviviale conçue pour rendre vos courses agréables et intuitives.
                        </p>
                    </div>
                </div>
                <div className="mt-10">
                    <p className="text-lg font-semibold text-gray-400 mb-6">
                        86% de nos clients déclarent être satisfaits de leur expérience avec notre application.
                    </p>
                    <p className="text-sm text-gray-500 mb-10">
                        Rejoignez des milliers d'utilisateurs qui simplifient leurs courses grâce à notre solution innovante.
                    </p>
                    <Link
                        to="/login"
                        className="bg-gray-700 text-white py-3 px-8 rounded-full text-xl font-medium shadow-lg hover:bg-gray-600"
                    >
                        Commencer
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
