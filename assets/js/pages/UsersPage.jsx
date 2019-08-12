import React, {useState, useEffect} from 'react';
import Pagination from "../components/Pagination";
import axios from "axios";
import UsersAPI from "../services/UsersAPI";

/*
    1. Page utilisateur avec firstName, lastName, email, Role, et nb de client  // Fait
    2. Un bouton lorsqu'on click sur le nb de client pour voir la liste des clients de l'utilisateur
    3. Sur cette liste des client de l'utilisateur un bouton pour voir les factures du client
    4. Deux boutons pour pouvoir éditer / supprimer les factures (du client de l'utilisateur)
    5. Un bouton modifier le Role de l'utilisateur
*/

const UsersPage = (props) => {

    const itemsPerPage = 6;

    const [users, setUsers] = useState([]);
    const [countUsers, setCountUsers] = useState(0);
    // tableaux d'état pour la pagination
    const [currentPage, setCurrentPage] = useState(1); // Par défaut currentPage sera à 1 (la page n°1)
    // tableau d'état de la barre de recherche
    const [search, setSearch] = useState("");


    const fetchUsers = async () => {
    // Fonction qui gère la requête pour récup tout les users
        try{
            const data = await UsersAPI.findAll();
            setUsers(data);
        }catch(error){
            console.log(error.response);
        }
    };
    
    const fetchCountInvoicesPerCustomer = async (id) => {
        try{
            const data = await axios
                .get("http://localhost:8000/api/customers/" + id)
                .then(result => result.data);

            console.log(data.invoices.length); // Retourne le nombre de factures pour un client donné

        }catch(error){
            console.log(error.response);
        }
    };

    useEffect(() =>{
        fetchUsers();
        fetchCountInvoicesPerCustomer("311");
    }, []);

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

    // Gestion des filtres de la recherche
    /* 
        On filtre notre tableau des users pour ne rechercher que par le firstName, lastName et email de l'utilisateur
    */
    const filteredUsers = users.filter(
        u =>
            u.firstName.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    // Calcul de la page de pagination en fonction du départ (du décallage ou offset)
    const paginatedUsers = Pagination.getData(
        filteredUsers, // Pagination sur le tableau des users (mais filtré avec "filteredUsers")
        currentPage, 
        itemsPerPage
    );
    

    return ( 
        <>
            
            {/* Bouton CREATION D'UNE FACTURE */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="mb-2">Liste des utilisateurs</h1>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="form-group">
                <input type="text" onChange={handleSearch} className="form-control" placeholder="Rechercher..." />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>email</th>
                        <th className="text-center">Nombre de client</th>
                        
                        <th className="text-center">Roles</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>

                    {paginatedUsers.map(user =>(

                    <tr key={user.id}>
                        <td>
                            {user.firstName}
                        </td>
                        <td>
                            {user.lastName}
                        </td>
                        <td>
                            {user.email}
                        </td>
                        <td className="text-center">
                            {/*Ajouter un onClick sur le tr Pour diriger vers la liste des clients*/}
                            <button className="btn btn-sm btn-info mr-2">
                                <span className="badge badge-light">{user.totalCustomers}</span> clients (voir la liste)
                            </button>
                        </td>
                        
                        <td className="text-center">
                            {/* ROLES (avec un espace entre) */}
                            {user.roles.map(role => (
                                role + " "
                            ))}
                        </td>
                        <td>
                            <button className="btn btn-sm btn-danger mr-2">
                                Modifier le Role
                            </button>
                        </td>
                    </tr>

                    ))}

                </tbody>
            </table>

            {/* PAGINATION */}
            {/* Condition si le nombre d'élément par page est inférieur au nombre du factures filtrées alors on affiche le composant Pagination */}
            {itemsPerPage < filteredUsers.length && (
                <Pagination 
                    currentPage={currentPage} 
                    itemsPerPage={itemsPerPage} 
                    itemsLength={filteredUsers.length} 
                    onPageChanged={handlePageChange} 
                />
            )}

                    
        </>
    );
};
 
export default UsersPage;
