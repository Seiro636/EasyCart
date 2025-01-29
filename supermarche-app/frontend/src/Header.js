import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
        const email = localStorage.getItem("userEmail");
        setIsLoggedIn(loggedInStatus);
        setUserEmail(email || "");
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail("");
        navigate("/login");
    };

    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <a href="/home" className="flex items-center">
                    <img src="/logo.webp" alt="Grocery Fast Logo" className="w-14 h-14 mr-2" />
                    <span className="text-3xl font-bold hover:text-gray-400">Grocery Fast</span>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <a href="/cart" className="hover:text-gray-400">Liste de course</a>
                    <a href="/user_cart" className="hover:text-gray-400">Mon panier</a>
                    {isLoggedIn ? (
                        <>
                            <a href="/profil" className="hover:text-gray-400">{userEmail}</a>
                            <button onClick={handleLogout} className="hover:text-gray-400">Déconnexion</button>
                        </>
                    ) : (
                        <a href="/login" className="hover:text-gray-400">Connexion</a>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden focus:outline-none"
                    aria-expanded={isMobileMenuOpen ? "true" : "false"}
                >
                    <svg
                        className="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-800 text-white px-6 py-4">
                    <a href="/cart" className="block py-2 hover:text-gray-400" onClick={closeMobileMenu}>Liste de course</a>
                    <a href="/user_cart" className="block py-2 hover:text-gray-400" onClick={closeMobileMenu}>Mon panier</a>
                    {isLoggedIn ? (
                        <>
                            <a href="/profil" className="block py-2 hover:text-gray-400" onClick={closeMobileMenu}>{userEmail}</a>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMobileMenu();
                                }}
                                className="block py-2 hover:text-gray-400"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <a href="/login" className="block py-2 hover:text-gray-400" onClick={closeMobileMenu}>Connexion</a>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
