import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, withRouter, Redirect} from "react-router-dom"; // composant react pour le rooting

import Navbar from './components/Navbar';
import Essai from './pages/Essai';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import AuthAPI from './services/AuthAPI';
import PrivateRoute from './components/PrivateRoute';

import AuthContext from './contexts/AuthContext'; // Contexte d'authentification pour notre application


// On apporte le css personnalisé
require('../css/app.css');

// Permet de savoir si l'utilisateur est authentifié
AuthAPI.setup();


const App = () => {
    // Etat pour savoir si l'utilisateur est authentifié (et donc connecté)
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    // On transforme notre composant "Navbar" en "NavbarWithRouter" pour lui permettre d'obtenir les capacités de rooting (history)
    const NavBarWithRouter = withRouter(Navbar);

    return (

        // Balise de CONTEXT (qui contient le contexte d'authentification, voir le fichier contexts/AuthContext.js)
        <AuthContext.Provider value={{
            // On dit que notre composant "AuthContext" fournis les valeurs isAuthenticated et seIsAuthenticated (pour notre balise AuthContext)
            isAuthenticated,
            setIsAuthenticated
        }} >
            {/* HasRouter est un composant REACT qui permet de gèrer des routes commençant par "#" (ex: #/customers ou #/invoices) */}
            <HashRouter>

                <NavBarWithRouter />

                <main className="container pt-5">
                    <Switch>
                        {/* Chemin vers la page de connexion */}
                        <Route path="/login" component={LoginPage} />
                        {/* Chemin vers la d'essai */}
                        <Route path="/essai" component={Essai} />
                        {/* Chemin vers la page des factures (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        {/* Chemin vers la page des clients (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        {/* Chemin vers la page d'accueil */}
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>

            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app'); // On récup la div id=app
ReactDOM.render(<App/>, rootElement); // On fait le rendu de l'element <App/>
