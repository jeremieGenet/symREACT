/*
    GESTION DES REQUETES CONCERNANT LES CUSTOMERS
*/

import axios from "axios";

// Trouve tous les clients
function findAll(){

    // Requête AJAX avec axios (librairie)
    return axios
        .get("http://localhost:8000/api/customers") // 
        // On nomme le retour de la requête: "result" et son contenu sera le tableau "hydra:membrer" (ensemble des customers sans les méta-données de l'api-platform)
        .then(result => result.data["hydra:member"] );
}

// Trouve un client
function find(id){
    return axios
        .get("http://localhost:8000/api/customers/" + id)
        .then(response => response.data);
}

// Ajoute un nouveau client
function create(customer){
    return axios.post("http://localhost:8000/api/customers", customer);
}

// Modifie un client
function edit(id, customer){
    return axios.put("http://localhost:8000/api/customers/" + id, customer);
}

// Supprime un client
function deleteCustomer(id){
    return axios.delete("http://localhost:8000/api/customers/" + id);
}


// Le fichier (lorsqu'il sera appelé retournera par défaut les fonctions findAll nommé findAll, deleteCustomer nommé delete ...)
export default {
    findAll: findAll,
    find: find,
    create: create,
    edit: edit,
    delete: deleteCustomer
}