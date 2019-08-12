/*
    GESTION DES REQUETES CONCERNANT LES USERS
*/
import axios from "axios";
import { USERS_API } from "../config";

function findAll(){
    return axios
    .get(USERS_API)
    .then(result => result.data["hydra:member"] );
}

// Permet d'enregister un nouvel utilisateur
function register(user){
    return axios
    .post(USERS_API, user
    );
}

export default {
    findAll, findAll,
    register: register
}