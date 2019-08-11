/*
    GESTION DES REQUETES CONCERNANT LES CUSTOMERS
*/

import axios from "axios";
import { CUSTOMERS_API } from "../config"; // contient les adresses url sous forme de constantes de notre application
import Cache from "./cache";

/*
// Trouve tous les clients (avec le systeme de Cache)
async function findAll(){
    // On rempli "cachedCustomers" de la promesse (Cache.get()) des clients (customersList)
    const cachedCustomers = await Cache.get("customersList");
    console.log(cachedCustomers);
    // Si le tableau de cache des clients (cachedCustomers) n'est pas null alors on le retourne (et fin de la fonction!)
    if(cachedCustomers) return cachedCustomers;

    // Requête AJAX avec axios (librairie du requêtes http)
    // On nomme le retour de la requête: "result" et son contenu sera le tableau "hydra:membrer" (ensemble des customers sans les méta-données de l'api-platform)
    return axios.get("http://localhost:8000/api/customers").then(result => {
        const customersList = result.data["hydra:member"]; // On récup la liste des customers
        Cache.set("customersList", customersList); // On met en cache la liste des customers
        return customersList; // On retourne le liste des customers
    });  
}
*/

// Trouve tous les clients
function findAll(){
    return axios
        .get(CUSTOMERS_API)
        .then(result => result.data["hydra:member"]); // On récup la liste des customers
}

// Trouve un client
function find(id){
    return axios
        .get(CUSTOMERS_API + "/" + id)
        .then(response => response.data);
}

// Ajoute un nouveau client
function create(customer){
    return axios.post(CUSTOMERS_API, customer);
}

// Modifie un client
function edit(id, customer){
    return axios.put(CUSTOMERS_API + "/" + id, customer);
}

/*
// Supprime un client (avec gestion du cache, MAIS UN BUG!)
function deleteCustomer(id){
    return axios
        .delete("http://localhost:8000/api/customers/" + id)
        .then(async response => {
            const cachedCustomers = await Cache.get("customers");

        if(cachedCustomers){
            console.log("ID = " + id);
            // On filtre le tableau des customers en ne gardant que les customers qui ont un id différent de l'id du client qui va être supprimé
            Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
        }
        return response;
    });
}
*/

// Supprime un client
function deleteCustomer(id){
    return axios.delete(CUSTOMERS_API + "/" + id);
}

// Le fichier (lorsqu'il sera appelé retournera par défaut les fonctions findAll nommé findAll, deleteCustomer nommé delete ...)
export default {
    findAll: findAll,
    find: find,
    create: create,
    edit: edit,
    delete: deleteCustomer
}