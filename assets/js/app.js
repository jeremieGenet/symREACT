import React, { useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Switch, Route, withRouter, Redirect} from "react-router-dom"; // composant react pour le rooting

import Navbar from './components/Navbar';
import Essai from './pages/Essai';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/form_pages/LoginPage';
import AuthAPI from './services/AuthAPI';
import PrivateRoute from './components/PrivateRoute';
import FormCustomerPage from './pages/form_pages/FormCustomerPage';

import AuthContext from './contexts/AuthContext'; // Contexte d'authentification pour notre application
import FormInvoicePage from './pages/form_pages/FormInvoicePage';
import RegisterPage from './pages/form_pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // On import le css de Tostify (pour les notifications)


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
                        {/* Chemin vers le formulaire de connexion */}
                        <Route path="/login" component={LoginPage} />
                        {/* Chemin vers le formulaire d'enregistrement' */}
                        <Route path="/register" component={RegisterPage} />
                        {/* Chemin vers le formulaire de création d'une facture (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/users" component={UsersPage} />
                        {/* Chemin vers la d'essai */}
                        <Route path="/essai" component={Essai} />
                        {/* Chemin vers le formulaire de création d'une facture (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/invoices/:id" component={FormInvoicePage} />
                        {/* Chemin vers la liste des factures (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        {/* Chemin vers le formulaire de création d'un client (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/customers/:id" component={FormCustomerPage} />
                        {/* Chemin vers la liste des clients (si l'utilisateur est authentifié, sinon redirection vers la page de connexion (composant fait main) */}
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        {/* Chemin vers la page d'accueil */}
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>

            </HashRouter>

            {/* Composant qui permet l'utilisation des Notifications à l'utilisateur */}
            <ToastContainer position={toast.POSITION.BOTTOM_CENTER} />

        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app'); // On récup la div id=app
ReactDOM.render(<App/>, rootElement); // On fait le rendu de l'element <App/>
