import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-12 mt-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Section gauche - Liens de navigation */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-300">Navigation</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/home" className="hover:text-teal-400 transition-all duration-300">Page Principale</a>
                            </li>
                            <li>
                                <a href="/info" className="hover:text-teal-400 transition-all duration-300">A propos de nous</a>
                            </li>
                            <li>
                                <a href="/" className="hover:text-teal-400 transition-all duration-300">Services</a>
                            </li>
                            <li>
                                <a href="/contact" className="hover:text-teal-400 transition-all duration-300">Contacte</a>
                            </li>
                        </ul>
                    </div>

                    {/* Section centrale - Mention légale */}
                    <div className="text-center md:text-center">
                        <h3 className="text-2xl font-semibold text-gray-300">Grocery Fast</h3>
                        <p className="mt-2 text-gray-400 text-sm">© {new Date().getFullYear()} Grocery Fast. Tous droits réservés.</p>
                    </div>

                    {/* Section droite - Réseaux sociaux */}
                    <div className="flex justify-center md:justify-end space-x-6">
                        <a href="https://facebook.com" className="text-gray-400 hover:text-teal-400 transition-all duration-300" target="_blank" rel="noopener noreferrer">
                            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 2.04C6.48 2.04 2 6.52 2 12s4.48 9.96 10 9.96 10-4.48 10-9.96-4.48-9.96-10-9.96zM12 17.3c-1.06 0-1.97-.84-1.97-1.87 0-1.02.91-1.86 1.97-1.86 1.06 0 1.97.84 1.97 1.86 0 1.03-.91 1.87-1.97 1.87zm1.09-3.57c-.6-.59-.94-1.41-.94-2.28 0-1.53 1.12-2.78 2.62-2.78s2.62 1.25 2.62 2.78c0 .87-.34 1.69-.94 2.28-.6.59-1.42.94-2.28.94s-1.69-.35-2.28-.94zm-.6-2.69c.33-.33.52-.77.52-1.3 0-.95-.73-1.73-1.68-1.73-.95 0-1.68.78-1.68 1.73 0 .52.19.97.52 1.3.33.33.77.52 1.28.52s.95-.19 1.28-.52z"></path>
                            </svg>
                        </a>
                        <a href="https://twitter.com" className="text-gray-400 hover:text-teal-400 transition-all duration-300" target="_blank" rel="noopener noreferrer">
                            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M23.635 4.557c-.883.391-1.83.654-2.82.774a4.928 4.928 0 0 0 2.16-2.724c-.95.56-2.004.964-3.13 1.18A4.918 4.918 0 0 0 16.44 2c-2.77 0-5.003 2.24-5.003 5.003 0 .39.042.765.12 1.13-4.165-.21-7.854-2.204-10.34-5.23a5.005 5.005 0 0 0-.676 2.52c0 1.74.88 3.28 2.22 4.19a4.907 4.907 0 0 1-2.268-.625v.062c0 2.436 1.734 4.472 4.036 4.932a4.98 4.98 0 0 1-2.22.084c.626 1.955 2.445 3.383 4.602 3.421a9.875 9.875 0 0 1-7.295 2.03 13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.017-7.516 14.017-14.017 0-.214-.005-.428-.014-.64a9.93 9.93 0 0 0 2.458-2.55z"></path>
                            </svg>
                        </a>
                        <a href="https://instagram.com" className="text-gray-400 hover:text-teal-400 transition-all duration-300" target="_blank" rel="noopener noreferrer">
                            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 2.163c3.163 0 3.486.01 4.724.068 1.29.059 2.375.327 3.253 1.205.878.878 1.146 1.963 1.205 3.253.058 1.238.068 1.561.068 4.724 0 3.163-.01 3.486-.068 4.724-.059 1.29-.327 2.375-1.205 3.253-.878.878-1.963 1.146-3.253 1.205-1.238.058-1.561.068-4.724.068-3.163 0-3.486-.01-4.724-.068-1.29-.059-2.375-.327-3.253-1.205-.878-.878-1.146-1.963-1.205-3.253-.058-1.238-.068-1.561-.068-4.724 0-3.163.01-3.486.068-4.724.059-1.29.327-2.375 1.205-3.253.878-.878 1.963-1.146 3.253-1.205 1.238-.058 1.561-.068 4.724-.068zm0-2.163c-3.287 0-3.673.012-5.02.073-1.29.061-2.418.37-3.418 1.37-1.04 1.04-1.309 2.187-1.37 3.418-.061 1.347-.073 1.732-.073 5.02 0 3.288.012 3.673.073 5.02.061 1.29.37 2.418 1.37 3.418 1.04 1.04 2.128 1.309 3.418 1.37 1.347.061 1.732.073 5.02.073 3.288 0 3.673-.012 5.02-.073 1.29-.061 2.418-.37 3.418-1.37 1.04-1.04 1.309-2.187 1.37-3.418.061-1.347.073-1.732.073-5.02 0-3.288-.012-3.673-.073-5.02-.061-1.29-.37-2.418-1.37-3.418-1.04-1.04-2.128-1.309-3.418-1.37-1.347-.061-1.732-.073-5.02-.073zm0 6.573c2.547 0 4.573 2.026 4.573 4.573s-2.026 4.573-4.573 4.573-4.573-2.026-4.573-4.573 2.026-4.573 4.573-4.573zm0 6.957c1.243 0 2.257-.97 2.257-2.257 0-1.243-.97-2.257-2.257-2.257-1.243 0-2.257.97-2.257 2.257 0 1.243.97 2.257 2.257 2.257zm6.499-6.833c-.805 0-1.459-.654-1.459-1.459 0-.805.654-1.459 1.459-1.459.805 0 1.459.654 1.459 1.459 0 .805-.654 1.459-1.459 1.459z"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
