import React from 'react';
import Header from './Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './LoginPage';
import Register from "./Register";
import Profil from "./Profil";
import Cart from "./Cart";
import Footer from "./Footer"
import User_Cart from "./User_Cart";
function App() {



  return (
      <Router>
          <Header /> {/* Le Header est présent sur toutes les pages */}

          <div className="min-h-screen bg-gray-100">
              <Routes>
                  <Route path="/" element={<Home />} /> {/* Page d'accueil */}
                  <Route path="/Home" element={<Home />} /> {/* Page d'accueil */}
                  <Route path="/login" element={<Login />} /> {/* Page de login */}
                  <Route path="/register" element={<Register />} /> {/* Page d'inscription */}
                  <Route path={"/profil"} element={<Profil />} /> {/* Page de profil */}
                  <Route path={"/cart"} element={<Cart />} /> {/* Page de panier */}
                    <Route path={"/user_cart"} element={<User_Cart />} /> {/* Page de panier */}

               </Routes>
          </div>
          <Footer />
      </Router>
  );
}
export default App;
