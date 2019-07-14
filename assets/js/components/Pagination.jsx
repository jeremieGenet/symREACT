import React from 'react'

const Pagination = ({currentPage, itemsPerPage, itemsLength, onPageChanged}) => {

    // customersLength est le tableau des customers et itemsPerPage représente le nb d'élément par page (défini dans la page qui possède la pagination)
    const nbPages = Math.ceil(itemsLength / itemsPerPage); // Math.ceil() permet d'arrondir à l'entier supérieur
    //console.log(nbPages); // Retourne le nb de pages pour notre pagination
    const pages = []; 

    // Boucle qui "rempli" notre tableau pages du nb de pages
    for(let i = 1; i <= nbPages; i++){
        pages.push(i); // Retournera un tableau avec le nb de pages : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }

    return ( 
        
        // <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length} onPageChanged={handlePageChange} />

        <div>
            <ul className="pagination pagination-sm">

                {/* PAGE PRECEDENTE */}
                {/* Condition si la page actuelle est la page 1 alors "disabled" est activé (ainsi le bouton précédent est désactivé) */}
                <li className={"page-item" + (currentPage === 1 && " disabled")}>

                    <button 
                    className="page-link"
                    onClick={() => onPageChanged(currentPage - 1)}
                    >
                        &laquo;
                    </button>

                </li>

                {/* NUMEROS DE PAGINATION */}
                {/* BOUCLE DU LI en fonction du nb de page */}
                {pages.map(page => 
                <li key={page} className={"page-item " + (currentPage === page && "active")}>

                    {/* Change la classe active lorsqu'on click sur la pagination */}
                    <button 
                    className="page-link"
                    onClick={() => onPageChanged(page)}
                    >
                        {page}
                    </button>

                </li>
                )}
                
                {/* PAGE SUIVANTE */}
                {/* Condition si la page actuelle vaut le nb total de pages alors "disabled" est activé (ainsi le bouton suivant est désactivé) */}
                <li className={"page-item" + (currentPage === nbPages && " disabled")}>

                    <button 
                    className="page-link"
                    onClick={() => onPageChanged(currentPage + 1)}
                    >
                        &raquo;
                    </button>

                </li>
            </ul>
        </div>
     );
};

// On ajoute une fonction "getData" au composant Pagination avec la notation Pagination.getData
// Cette fonction donne les données utiles à la pagination
Pagination.getData = (items, currentPage, itemsPerPage) =>{
    // Calcul du départ de la pagination
    const start = currentPage * itemsPerPage - itemsPerPage;
    // soit ex:  =      4      *      10      -      10         = 30 (on démarre alors à 30)

    // Retourne le calcul de la page de pagination en fonctin du départ (du décallage ou offset)
    return items.slice(start, start + itemsPerPage);
}
 
export default Pagination;