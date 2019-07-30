import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import { Link } from "react-router-dom";


const CustomersPage = (props) => {

    // Nombre de customer par page
    const itemsPerPage = 12;
    // tableaux d'état de l'ensemble des clients
    const [customers, setCustomers] = useState([]);
    // tableaux d'état pour la pagination
    const [currentPage, setCurrentPage] = useState(1); // Par défaut currentPage sera 1 (la page n°1)
    // tableau d'état de la barre de recherche
    const [search, setSearch] = useState("");

    // Permet de récup les customers
    const fetchCustomers = async () => {
        try{
            const data = await CustomersAPI.findAll()
            setCustomers(data);
        }catch(error){
            console.log(error.response)
        }
    }

    // AU CHARGEMENT DU COMPOSANT ON VA CHERCHER LES CUSTOMERS
    // useEffect() est un Hook, et permet de signifier qu'au chargement du composant "CustomersPage" on ajoute un "effet" (comme un événement)
    // il s'agira d'une requête AJAX pour récup tous les customers
    useEffect(() =>{
        fetchCustomers();
        /*
        // Requête AJAX (via la fonction findAll() du fichier services/CustomersAPI.jsx) avec axios (librairie)
        CustomersAPI.findAll()
        .then(data => setCustomers(data)) // data représente alors le tableau "hydra:membrer" (nos customers), et sera stocker dans "setCustomers"
        .catch(error => console.log(error.response)); // Gestion des erreurs
        */

    }, []);

    // Gestion de la suppression d'un customer. (le mot "async" est utile si on utilise un try/catch pour la requête)
    const handleDelete = async id => {
        // Création d'une tableau similaire au tableau des customers original (dans le but de le récup si la requête serveur ne fonctionne pas)
        const originalCustomers = [...customers];
        //console.log("tableau" + [...customers]); // Affiche un tableau qui contient les customers

        // On filtre le tableau des customers et on ne garde que les customer dont l'id est différent de celui reçu en param (soit l'id du bouton cliqué)
        setCustomers(customers.filter(customer => customer.id !== id));

        //console.log(id); // renvoi l'id du client

        try{
            await CustomersAPI.delete(id)
        }catch(error){
            // Si il y a une erreur de réponse serveur, alors on réinitialise le tableau des customers (notre tableau copier en début de fonction)
            setCustomers(originalCustomers);
            console.log("erreur dans l'intitulé de la requête!!!!");
        }
        /* // Requ
        CustomersAPI.delete(id)
        .then(response => console.log("ok cela fonctionne !!!!")) // Si la requête fonctionne alors (message dans la console)
        .catch(error => {
            setCustomers(originalCustomers); // Si il y a une erreur de réponse serveur, alors on réinitialise le tableau des customers (notre tableau copier en début de fonction)
            console.log("Erreur de Reponse de la requete " + error.response);
        });
        */
    };

    // Gestion de la pagination (changement de pages)
    const handlePageChange = (page) => {
        //console.log("page vaut = " + page); // Affiche le nb de la page active (lorsqu'on click sur la pagination)
        setCurrentPage(page);
    }

    // Gestion de la recherche (du champ de recherche)
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        //console.log(value); // Affiche ce qui est inscrit dans le champ de recherche
        setCurrentPage(1); // On remet la recherche à la page actuelle n°1
    }

    // On filtre notre tableau des customers pour ne récup que les firstName et lastName qui comportent la valeur de la recherche (attribut value de l'input de recherche)
    const filteredCustomers = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase())) // company peut être NULL et la fonction includes ne permet pas la valeur NULL
    );
    // Calcul de la page de pagination en fonction du départ (du décallage ou offset)
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, // Pagination sur le tableau des customers (mais filtré avec "filteredCustomers"
        currentPage, 
        itemsPerPage
    );


    return ( 
        <>
            {/* Bouton CREATION D'UN CLIENT */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-2">Liste des clients</h1>
                {/* "Link" est un composant REACT-DOM-ROUTER qui à les attributs du rooting */}
                <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {/* BOUCLE DU TR DES CUSTOMERS (l'ensemble des clients) */}
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>{/* Ajout d'une clé unique (l'id de chaque client) pour l'optimisation de REACT */}
                            <td>
                                {customer.id}
                            </td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>
                                {customer.email}
                            </td>
                            <td>
                                {customer.company}
                            </td>
                            <td className="text-center">
                                <span className="badge badge-light">{customer.invoices.length}</span>
                            </td>
                            {/* toLocaleString() est une fonction javascript renvoie une chaine de caractère au format des conventions locales */}
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                {/* Lors du clique on supprime le client (seulement s'il n'a pas de facture) */}
                                {/* le bouton sera désactivé si le nb de facture du client est sup à 0 */}
                                <button 
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0} 
                                className="btn btn-sm btn-danger">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* FIN DE BOUCLE DU TR (des customers) */}
                    
                </tbody>
            </table>

            {/* PAGINATION */}

            {/* Condition si le nombre d'élément par page est inférieur au nombre du clients filtrés alors on affiche le composant Pagination */}
            {itemsPerPage < filteredCustomers.length && (
            <Pagination 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                itemsLength={filteredCustomers.length} 
                onPageChanged={handlePageChange} 
            />
            )}

        </>
    );
}
 
export default CustomersPage;