/*
    GESTION DES REQUETES CONCERNANT LES USER
*/

import axios from "axios";

function findAll(){
    return axios
    .get("http://localhost:8000/api/users")
    .then(result => result.data["hydra:member"] );
}

// Permet d'enregister un nouvel utilisateur
function register(user){
    return axios
    .post("http://localhost:8000/api/users", user
    );
}

export default {
    findAll, findAll,
    register: register
}