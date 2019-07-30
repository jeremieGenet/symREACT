import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from '../services/InvoicesAPI';

// la props "history" fait parti de tout composant REACT et permet de faire des redirection (rooting)
const FormInvoicePage = ({history, match}) => {

    // On récup en param d'url l'id et on lui donne "new" comme valeur par défaut
    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })

    // Etat des clients
    const [customers, setCustomers] = useState([]);

    // Etat qui dit si on est en mode édition de la facture ou non (false par défaut)
    const [editing, setEditing] = useState(false);

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    // Récup l'ensemble des clients
    const fetchCustomers = async () => {
        try{
            const data = await CustomersAPI.findAll();
            setCustomers(data); // data représent un tableau avec l'ensemble des clients
            // Si le client de la facture est vide (non défini dans le formulaire) alors on donne à "setInvoice" le premier customer chargé
            // on met une copie de invoice (...invoice) et on change par le premier client du tableau data (comme cela on aura le premier client par défaut)
            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id});
        }catch(error){
            console.log(error.response);
            // TODO : flash notification erreur

            history.replace("/invoices") // Redirection vers la liste des invoices
        }
    }

    // Récup une facture (invoice)
    const fetchInvoice = async id => {
        try{
            // On récup les propriétés "amount status et customer" de requête qui récup un facture via son id
            const { amount, status, customer } = await InvoicesAPI.find(id);
        // On met à jour le "setInvoice" en modifiant le customer par le customer id (parce que customer est un objet, alors que l'on ne veut que son id)    
        setInvoice({ amount, status, customer: customer.id}); 
        }catch(error){
            console.log(error.response);
            // TODO : flash notification erreur

            history.replace("/invoices") // Redirection vers la liste des invoices
        }
    }

    // Effet qui doit être fait dès le départ de l'appel du composant (récup l'ensemble des clients)
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Effet qui récup la bonne facture lorque "id" dans l'url change
    useEffect(() => {
        if(id !== "new"){
            setEditing(true); // Passage en mode edition
            fetchInvoice(id); // On récup la facture via son id
        }
    }, [id]);

    // Gestion des changements des inputs (champs) du formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget; // l'event currentTaget va prendre les attributs name et value des champs
        setInvoice({...invoice, [name]: value}); // On modifie l'état setCustomer en prenant tous ce qu'il y a dans invoice et en remplaçant l'attribut name par ce qu'il y a dans value
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        //console.log(invoice);
        try{
            // Si on est en mode édition de la facture on fait une requete en put (modification), sinon une requete en post (poster une nouvelle facture)
            if(editing){
                // On modifie une invoice via son id
                await InvoicesAPI.edit(id, invoice);
                // TODO : Flash notif success
            }else{
                // On post la facture via son id (mais l'id de l'api sous forme "api/customer/" + invoice.customer)
                await InvoicesAPI.create(invoice);
                // TODO : Flash de notif success
    
                history.replace("/invoices"); // Redirection vers la liste des factures
            }

        }catch({ response }){
            //console.log(violations); // Affiche un tableau avec les différentes erreurs
            const { violations } = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message; // On rempli notre objet apiErrors des noms et des erreurs
                });

                setErrors(apiErrors); // On rempli notre Etat des erreurs par le tableau des erreurs (ce qui permet un affichage des erreurs dans le formulaire)

                // TODO : Flash notification d'erreurs
            }
        }
    } 

    return ( 
        <>
            {/* Condition Si on est en mode édition alors le h1 change */}
            {editing && <h1>Modification d'une facture</h1> || <h1>Création d'une facture</h1>}

            <form onSubmit={handleSubmit} >
                <Field 
                    name="amount"
                    type="number"
                    label="Montant" 
                    placeholder="Montant de la facture" 
                    value={invoice.amount} 
                    onChange={handleChange} 
                    error={errors.amount}
                />

                <Select
                    name="customer"
                    label="Clients"
                    value={invoice.customer}
                    error={errors.customer}
                    onChange={handleChange}
                >
                    {/* BOUCLE sur les customers */}
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                    <option value="1">Jérémie Genet</option>
                    <option value="1">Sabrina Michaud</option>
                </Select>

                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    error={errors.status}
                    onChange={handleChange}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>
                

                <div className="form-group mt-4">
                    <button type="submit" className="btn btn-success">Enregister</button>
                    <Link to="/invoices" className="btn btn-link">Retour à la liste </Link>
                </div>
            </form>
        </>
     );
}
 
export default FormInvoicePage;