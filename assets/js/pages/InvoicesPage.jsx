import moment from "moment"; // librairie "moment" qui gère le formatage des dates
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";


const InvoicesPage = (props) => {

    // Nombre de invoices par page
    const itemsPerPage = 10;
    // tableau d'état de l'ensembre des invoices
    const [invoices, setInvoices] = useState([]);
    // tableaux d'état pour la pagination
    const [currentPage, setCurrentPage] = useState(1); // Par défaut currentPage sera 1 (la page n°1)
    // tableau d'état de la barre de recherche
    const [search, setSearch] = useState("");
    // tableau d'état qui sert au système de loader (libraire "React-content-loader")
    const [loading, setLoading] = useState(true); // notre loading est à "true" au départ (par défaut)

    // Objet qui gère la classe html du statut des factures (pour en modifier le coloris)
    const INVOICES_STATUS = {
        "SENT": "light",
        "PAID": "success",
        "CANCELLED": "danger"
    }
    // Objet qui gère le nom du statut des factures (pour le modifier en français)
    const INVOICES_LABEL = {
        "SENT": "Envoyée",
        "PAID": "Payée",
        "CANCELLED": "Annulée"
    }

    // Fonction qui gére le formatage de date (utilisation de la librairie "moment")
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    // Fonction qui gère la requête pour récup toutes les invoices
    const fetchInvoices = async () => {
        try{
            const data = await InvoicesAPI.findAll()
            setInvoices(data);3
            setLoading(false); // Quand on a fini de récup les invoices on met notre système de loading à "false"
        }catch(error){
            //console.log(error.response);
            toast.error("Erreur lors du chargement des factures ! 😈"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
        }
    };

    useEffect(() =>{
        fetchInvoices();
        /*
        // Requête AJAX (via la fonction findAll() du fichier services/CustomersAPI.jsx) avec axios (librairie)
        CustomersAPI.findAll()
        .then(data => setCustomers(data)) // data représente alors le tableau "hydra:membrer" (nos customers), et sera stocker dans "setCustomers"
        .catch(error => console.log(error.response)); // Gestion des erreurs
        */

    }, []);

    // Gestion de la suppression d'un invoice. (le mot "async" est utile si on utilise un try/catch pour la requête)
    const handleDelete = async id => {
        // Création d'une tableau similaire au tableau des invoices originales (dans le but de le récup si la requête serveur ne fonctionne pas)
        const originalInvoices = [...invoices];
        //console.log("tableau" + [.. invoices]); // Affiche un tableau qui contient les invoices
        toast.success("La facture à bien été supprimée !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
        // On filtre le tableau des invoices et on ne garde que les invoices dont l'id est différent de celui reçu en param (soit l'id du bouton cliqué)
        setInvoices(invoices.filter(invoice => invoice.id !== id));
        //console.log(id); // renvoi l'id du client
        try{
            await InvoicesAPI.delete(id)
            //toast.success("La facture à bien été supprimée !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
        }catch(error){
            toast.error("Une erreur est survenue !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
            // Si il y a une erreur de réponse serveur, alors on réinitialise le tableau des invoices (notre tableau copier en début de fonction)
            setInvoices(originalInvoices);
            console.log("erreur dans l'intitulé de la requête!!!!");
        }
    };

    // Gestion de la pagination (changement de pages)
    const handlePageChange = (page) => {
        //console.log("page vaut = " + page); // Affiche le nb de la page active (lorsqu'on click sur la pagination)
        setCurrentPage(page);
    }
    // Gestion de la recherche (champ de recherche)
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        //console.log(value); // Affiche ce qui est inscrit dans le champ de recherche
        setCurrentPage(1); // On remet la recherche à la page actuelle n°1
    }

    // Gestion des filtres de la recherche
    /* 
        On filtre notre tableau des customers pour ne récup que les firstName et lastName du client de la facture, le montant et le statut de celle-ci
        qui comportent la valeur de la recherche (attribut value de l'input de recherche)
    */
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            INVOICES_LABEL[i.status].toLowerCase().includes(search.toLowerCase())
    );
    
    // Calcul de la page de pagination en fonction du départ (du décallage ou offset)
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, // Pagination sur le tableau des invoices (mais filtré avec "filteredInvoices")
        currentPage, 
        itemsPerPage
    );

    

    return ( 
        <>
            {/* Bouton CREATION D'UNE FACTURE */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-2">Liste des factures</h1>
                {/* "Link" est un composant REACT-DOM-ROUTER qui à les attributs du rooting */}
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th>Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>

                {/* Condition : Si loading vaut false (!loading) alors on affiche le contenu de "tbody" */}
                {!loading && (
                    <tbody>
                    {paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>{/* Ajout d'une clé unique (l'id de chaque client) pour l'optimisation de REACT */}
                            <td>
                                {invoice.id}
                            </td>
                            <td>
                                {/* NOM ET PRENOM DU CLIENT (de la facture) avec lien vers le formulaire de  modification de cette facture */}
                                <Link to={"/invoices/" + invoice.id} className="mr-2">{invoice.customer.firstName} {invoice.customer.lastName}</Link>
                            </td>
                            <td className="text-center">
                                {/* DATE (formatée avec notre fonction formatDate() construite à partir de la librairie "moment") */}
                                {formatDate(invoice.sentAt)}
                            </td>
                            <td>
                            {/* Statut de la facture (ici on modifie la classe en fonction du statut pour modifier le coloris) */}
                            <span className={"badge badge-" + INVOICES_STATUS[invoice.status]}>{INVOICES_LABEL[invoice.status]}</span>
                            </td>
                            <td className="text-center">
                                {invoice.amount.toLocaleString()} €
                            </td>
                            <td>
                                {/* Lien vers la facture à éditer via son id */}
                                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-dark mr-2">Editer</Link>
                                <button 
                                className="btn btn-sm btn-danger mr-2"
                                onClick={() => handleDelete(invoice.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                )}
            </table>

            {/* Si "loading" vaut "true" on affiche notre Composant de loading */}
            {loading && <TableLoader />}

            {/* PAGINATION */}
            {/* Condition si le nombre d'élément par page est inférieur au nombre du factures filtrées alors on affiche le composant Pagination */}
            {itemsPerPage < filteredInvoices.length && (
                <Pagination 
                    currentPage={currentPage} 
                    itemsPerPage={itemsPerPage} 
                    itemsLength={filteredInvoices.length} 
                    onPageChanged={handlePageChange} 
                />
            )}

        </>
    );
};
 
export default InvoicesPage;