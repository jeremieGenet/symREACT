// imr
import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import AuthAPI from "../services/AuthAPI";

import AuthContext from "../contexts/AuthContext"; // On récup le context (d'authentification)


// sfc
const Navbar = ({ history }) => {

    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

    // Gère la déconnexion de l'utilisateur
    const handleLogout = () => {
        AuthAPI.logout();
        setIsAuthenticated(false);
        history.push('/login'); // Redirection vers la page du connexion 
    };

    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <NavLink className="navbar-brand" to="/" >
                SymREACT
            </NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/customers">Clients</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/invoices">Factures</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/essai">ESSAI</NavLink>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">

                    {/* Si l'utilisateur n'est pas connecté on affiche les boutons "Inscription" et "Connexion" sinon... */}
                    {!isAuthenticated && <>
                        <li className="nav-item">
                        <NavLink to="/register" className="btn btn-info mr-2">
                            Inscription
                        </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/login" className="btn btn-success mr-2">
                                Connexion !
                            </NavLink>
                        </li>
                    {/* ... Si l'utilisateur est connecté on affiche alors le bouton "Deconnexion" */}
                    </> || (
                    <li className="nav-item">
                        <button onClick={handleLogout} className="btn btn-dark">Déconnexion !</button>
                    </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
 
export default Navbar;
