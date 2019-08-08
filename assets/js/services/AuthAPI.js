/*
    GESTION DES REQUETES CONCERNANT L'AUTHENTIFICATION
*/

import axios from "axios";
import jwtDecode from "jwt-decode"; // Librairie qui permet de décoder un token jwt (de la librairie jwt)

/**
 * Déconnexion (suppression du token du localStorage et sur axios)
 */
function logout(){
    // On supprime de localStorage (espace mémoire de l'app) le token
    window.localStorage.removeItem("authToken");
    // On retire la propriété "Authorization" des header de axios
    delete axios.defaults.headers["Authorization"];
}

/**
 * Permet via axios de faire une requête qui va récup le token d'authentification et le stoker dans "localStorage" de l'application
 * @param {object} credentials 
 */
function authenticate(credentials){
    // On envoi à axios le requête suivante avec les informations du formulaire (credentials)
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token) // On récup la réponse à notre requête, on en extrait le token
        .then(token => {
            // On stock le token dans notre localStorage (espace mémoire de l'app)
            window.localStorage.setItem("authToken", token);
            // On prévient axios qu'on a maintenant un header par défaut sur toutes nos futures requêtes HTTP
            axios.defaults.headers["Authorization"] = "Bearer " + token; // ATTENTION l'espace que se trouve après Bearer est obligatoire (l'api renvoi le header (Bearer) un espace puis le token)
    });
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup(){
    // on récup le token dans le localStorage
    const token = window.localStorage.getItem("authToken");
    // Si il y a bien un token alors on le décode pour vérif si il est toujours valide
    if(token){
        const jwtData = jwtDecode(token);
        // console.log(jwtData); // Affiche le décodage du token (dans lequel on retrouve le fistName, lastName... mais surtout le timestamp de durée du token avec son début et sa fin)
        // le fois 1000 parce que le timestamp d'expiration est en milisecondes
        if(jwtData.exp * 1000 > new Date().getTime()){
            // On récup le token et les header
            axios.defaults.headers["Authorization"] = "Bearer " + token;
            //console.log("connexion établie avec axios !!!");
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated(){

    const token = window.localStorage.getItem("authToken");

    if(token){
        const jwtData = jwtDecode(token);
        // console.log(jwtData); // Affiche le décodage du token (dans lequel on retrouve le fistName, lastName... mais surtout le timestamp de durée du token avec son début et sa fin)
        // le fois 1000 parce que le timestamp d'expiration est en milisecondes
        if(jwtData.exp * 1000 > new Date().getTime()){
            axios.defaults.headers["Authorization"] = "Bearer " + token;
            return true;
        }
        return false;
    }
}

export default{
    authenticate: authenticate,
    logout: logout,
    setup: setup,
    isAuthenticated
};