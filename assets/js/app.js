import React from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route} from "react-router-dom";
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';


// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Hello Webpack Encore!!! Edit me in assets/js/app.js !!!');

const App = () => {
    return (
        /* HasRouter est un composant REACT qui permet de gèrer des routes commençant par "#" (ex: #/customers ou #/invoices) */
        <HashRouter>

            <Navbar />

            <main className="container pt-5">
                <Switch>
                    {/* Chemin vers la page des factures */}
                    <Route path="/invoices" component={InvoicesPage} />
                    {/* Chemin vers la page des clients */}
                    <Route path="/customers" component={CustomersPage} />
                    {/* Chemin vers la page d'accueil */}
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>

        </HashRouter>
    );
};

const rootElement = document.querySelector('#app'); // On récup la div id=app
ReactDOM.render(<App/>, rootElement); // On fait le rendu de l'element <App/>
