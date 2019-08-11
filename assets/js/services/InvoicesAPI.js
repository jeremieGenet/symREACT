/*
    GESTION DES REQUETES CONCERNANT LES CUSTOMERS
*/
import axios from "axios";
import { INVOICES_API } from "../config";

// Trouver toutes les factures
function findAll(){

    // Requête AJAX avec axios (librairie)
    return axios
    .get(INVOICES_API) // 
    // On nomme le retour de la requête: "result" et son contenu sera le tableau "hydra:membrer" (ensemble des customers sans les méta-données de l'api-platform)
    .then(result => result.data["hydra:member"] );
}

// Trouver un facture (via son id)
function find(id){
    return axios
    .get(INVOICES_API + "/" + id)
    .then(response => response.data);;
}

// Création d'une facture
function create(invoice){
    return axios
        // ATTENTION! On veut posté à notre API l'id du client et cet id est sous la forme "/api/customer/69" soit l'id en fin de chaine
        .post(INVOICES_API, {...invoice, customer: `api/customers/${invoice.customer}` }); // On remplace la propriété customer par : "api/customers/" + invoice.customer
}

// Modifier une facture
function edit(id, invoice){
    return axios
    .put(INVOICES_API + "/" + id, { ...invoice, customer: "api/customers/" + invoice.customer});
}

// Supprimer une facture
function deleteInvoice(id){
    return axios.delete(INVOICES_API + "/" + id);
}

// Le fichier (lorsqu'il sera appelé retournera par défaut les fonctions findAll nommé findAll, deleteInvoices nommé delete ...)
export default {
    findAll: findAll,
    find:find,
    create: create,
    edit: edit,
    delete: deleteInvoice
}