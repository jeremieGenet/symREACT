/**
 * Composant qui permet d'avoir des route privée (seulement si l'utilisateur est authentifié)
 */

import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext'; // Contexte d'authentification pour notre application
import { Route, Redirect } from "react-router-dom"; // composant react pour le rooting

const PrivateRoute = ({path, component}) => {
    const {isAuthenticated} = useContext(AuthContext);
    // Si l'utilisateur est authentifié on retourne une route avec son composant, sinon on redirige vers la page de connexion
    return isAuthenticated ? ( 
    <Route path={path} component={component} /> 
    ) : (
    <Redirect to="/login" />
    );
}

export default PrivateRoute;