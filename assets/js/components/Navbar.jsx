// imr
import React from 'react';

// sfc
const Navbar = (props) => {
    return ( 
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">SymREACT</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Clients</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Factures</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Essai</a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a href="#" className="btn btn-info mr-2">Inscription</a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-success mr-2">
                            Connexion !
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-dark">Déconnexion !</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
 
export default Navbar;
