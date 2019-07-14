/*
    GESTION DES REQUETES CONCERNANT LES CUSTOMERS
*/

import axios from "axios";

// Trouver toutes les factures
function findAll(){

    // Requête AJAX avec axios (librairie)
    return axios
    .get("http://localhost:8000/api/invoices") // 
    // On nomme le retour de la requête: "result" et son contenu sera le tableau "hydra:membrer" (ensemble des customers sans les méta-données de l'api-platform)
    .then(result => result.data["hydra:member"] );

}

// Supprimer une facture
function deleteInvoice(id){
    return axios.delete("http://localhost:8000/api/invoices/" + id);
}

// Le fichier (lorsqu'il sera appelé retournera par défaut les fonctions findAll nommé findAll, deleteInvoices nommé delete ...)
export default {
    findAll: findAll,
    delete: deleteInvoice
}