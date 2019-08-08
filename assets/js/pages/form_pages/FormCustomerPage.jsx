import React, { useState, useEffect } from 'react';
import Field from '../../components/forms/Field';
import { Link } from "react-router-dom";
import CustomersAPI from '../../services/CustomersAPI';
import { toast } from 'react-toastify';
import FormContentLoader from "../../components/loaders/FormContentLoader";

const FormCustomerPage = ({ match, history}) => {
    // id va représenté le param passé en get dans l'url (new par défaut sinon il vaudra un nombre qui correspond à l'id du client "match")
    const {id = "new"} = match.params; 

    // Etat des champs de notre formulaire
    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "", 
        company: ""
    });

    // Etat des erreurs (permettant des stocker des erreur pour chacun des champs)
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "", 
        company: ""
    });

    // Etat qui va définir si on est en édition de client ou en modification d'un client (via un boolean)
    const [editing, setEditing] = useState(false);

    // tableau d'état qui sert au système de loader (libraire "React-content-loader")
    const [loading, setLoading] = useState(false); // notre loading est à "false" au départ (par défaut)

    // Récup du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
        try{
            const { firstName, lastName, email, company } = await CustomersAPI.find(id);
            //console.log(data); // Affiche un objet avec toutes les infos sur notre client (mais il y trop de détail sur le client comme le context, le user...)
             // De "data" on ne prend que les attributs firstName, lastName, email et compagny
            setCustomer({ firstName, lastName, email, company }) // Et on met à jour l'Etat setCustomer (ce qui a pour effet de pré-remplir les champs du formulaire de modif du client)
            setLoading(false); // Quand on a fini de récup le customer on met notre système de loading à "false"
        }catch(error){
            console.log(response);
            toast.error("Le client n'a pas pu être chargé !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
            history.replace("/customers"); // On redirige vers la page des clients (si il y a une erreur)
        }
    }

    // Chargement du customer si besoin au chargement du composant ou au chargement de l'identification
    useEffect(() => { // Effet à chaque modification de la variable "id"
        // Si le param d'url est différent de "new" alors...
        if(id !== "new"){
            setLoading(true) // On met notre système de loading en route (true) puisque ici on va faire une requête (fetchCustomer) et donc un temps de chargement
            setEditing(true); // On met le mode edition à true
            fetchCustomer(id); // On récup notre customer via son id
        }
    }, [id])

    // Gestion des changements des inputs (champs) du formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget; // l'event currentTaget va prendre les attributs name et value des champs
        setCustomer({...customer, [name]: value}); // On modifie l'état setCustomer en prenant tous ce qu'il y a dans customer et en remplaçant l'attribut name par ce qu'il y a dans value
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault(); // On annule le comportement par défaut
        //console.log(customer); // Affiche un objet qui contient les infos passées dans le formulaire

        try{
            setErrors({}); // On vide le tableau des erreurs
            // Si on est en mode édition, on fait une requête en "put" à axios et on lui passe les données du formulaire (customer)
            if(editing){
                const response = await CustomersAPI.edit(id, customer);
                //console.log(response.data); // Affiche un objet qui contient les infos sur le client après modification
                toast.success("Le client a bien été modifié !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
                history.replace("/customers"); // On redirige vers la page des clients
            }else{
                // Sinon on post le formulaire de création du nouveau client
                const response = await CustomersAPI.create(customer);
                //console.log(response.data); // Affiche un objet qui contient les infos sur le client créé
                toast.success("Le client à bien été créé !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
                history.replace("/customers"); // On redirige vers la page des clients
            }
        }catch({ response }){
            //console.log(error.response.data.violations); // Affiche un tableau avec les différentes erreurs
            const { violations } = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message; // On rempli notre objet apiErrors des noms et des erreurs
                });
                setErrors(apiErrors); // On rempli notre Etat des erreurs par le tableau des erreurs (ce qui permet un affichage des erreurs dans le formulaire)
                toast.error("Des erreurs dans votre formulaires !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
            }
        }
    };

    return ( 
        <>
            {/* CONDITION:  Si on est pas en mode edition alors le h1 est Création... sinon le h1 est Modification... */}
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1>}

            {/* CONDITION: Si loading vaut false alors on affiche le formulaire */}
            {!loading && (
                <form onSubmit={handleSubmit} >
                    <Field 
                        name="firstName" 
                        label="Prénom" 
                        placeholder="Prénom du client" 
                        value={customer.firstName} 
                        onChange={handleChange} 
                        error={errors.firstName}
                    />
                    <Field 
                        name="lastName" 
                        label="Nom de famille" 
                        placeholder="Nom de famille du client" 
                        value={customer.lastName} 
                        onChange={handleChange} 
                        error={errors.lastName}
                    />
                    <Field 
                        name="email" 
                        label="Email" 
                        placeholder="Email du client" 
                        value={customer.email} 
                        onChange={handleChange} 
                        error={errors.email}
                    />
                    <Field 
                        name="company" 
                        label="Entreprise" 
                        placeholder="Entreprise du client" 
                        value={customer.company} 
                        onChange={handleChange} 
                        error={errors.company} 
                    />

                    <div className="form-group mt-4">
                        <button type="submit" className="btn btn-success">Enregister</button>
                        <Link to="/customers" className="btn btn-link">Retour à la liste </Link>
                    </div>
                </form>
            )}

            {/* CONDITION : Si loading vaut true on affiche notre Composant de loading de formulaire */}
            {loading && <FormContentLoader />}

        </>
     );
}
 
export default FormCustomerPage;
