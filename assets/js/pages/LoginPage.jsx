import React, {useState, useContext} from 'react';
import AuthAPI from '../services/AuthAPI';
import AuthContext from '../contexts/AuthContext';

// la props "history" permet de faire des redirection (rooting)
const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    // Etat qui représente les champs des input username et password du formulaire
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    // Etat qui réprésente les erreurs du formulaire
    const [error, setError] = useState(""); // Vide par défaut

    // Gestion des champs
    const handleChange = ({currentTarget}) => {
        // "value" et "name" vaudront l'attribut value et name de l'input dans lequel il y a la fonction handleChange()
        const {value, name} = currentTarget; 

        setCredentials({...credentials, [name]: value}); 
        //console.log(credentials);
        //console.log({...credentials})
        //console.log(name); // affiche username lorsqu'on écrit dans l'input nommé username et affiche password lorsqu'on écrit dans l'input nommé password
        //console.log(value); // Affiche se qui est tapé dans les inputs "username" et "password" (lettre par lettre)
    };

    // Gestion de la soummission du formulaire
    const handleSubmit = async event => {
        event.preventDefault(); // On annule le comportement par défaut
        //console.log(credentials); // Affiche un objet qui contient les infos passée dans le formulaire de type : Object{username: "contenu de l'input username", password: "contenu de l'input password"}

        try{
            await AuthAPI.authenticate(credentials);
            console.log("connexion réussi !!!");
            setError(""); // On vide les erreur (s'il y en a)
            setIsAuthenticated(true); // On dit que l'on est authentifié (props passé par le composant Navbar dans app.js)
            history.replace("/"); // Méthode "replace" de history qui permet une Redirection d'url, ici vers la page d'accueil
        }catch(error){
            console.log("connexion échouée !!!")
            //console.log(error.response);
            setError("Aucun compte ne possède cette adresse ou les informations ne correspondent pas !");
        }
    }

    return ( 
        <>
            <h1>Page de connexion</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        placeholder="Adresse email de connexion" 
                        name="username" 
                        id="username"
                        /* 
                            La classe "is-invalid" est une classe Bootstrap qui si elle est présente permet l'affichage de le classe "invalid-feedback",
                            ici elle est ajoutée si il y a une erreur et permet l'affichage du paragraphe suivant
                        */
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {/* ERREUR FORMULAIRE */}
                    {/* CONDITION: si il y a une "error" alors on affiche le paragraphe classe = invalid-feedback et le contenu de l'erreur */}
                    {error && 
                    <p className="invalid-feedback">
                        {error}
                    </p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Votre mot de passe"
                        className="form-control"
                        name="password"
                        id="password"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte !</button>
                </div>
            </form>
        </>
     );
}
 
export default LoginPage;