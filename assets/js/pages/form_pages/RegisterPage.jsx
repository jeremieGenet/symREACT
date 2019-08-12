import React, { useState } from 'react';
import Field from '../../components/forms/Field';
import { Link } from "react-router-dom";
import Field_Autofocus from '../../components/forms/Field_Autofocus';
import UsersAPI from "../../services/usersAPI";
import { toast } from 'react-toastify';


const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des changements des inputs (champs) du formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget; // l'event currentTaget va prendre les attributs name et value des champs
        setUser({...user, [name]: value}); // On modifie l'état setUser en prenant tous ce qu'il y a dans user et en remplaçant l'attribut name par ce qu'il y a dans value
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log(user); // Affiche un objet contenant les propriétés de l'utilisateur entrées dans le formulaires

        const apiErrors = {}; // On crée un objet vide (qui va stocker nos erreur)

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe est différente du mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaires !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
            return; // On stop le script ici (avec le return)
        }

        try{
            // On enregistre notre nouvel utilisateur
            await UsersAPI.register(user);
            setErrors({}); // On vide notre objet des erreurs
            toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
            history.replace('/login'); // Redirection vers la page de connexion
            
        }catch(error){
            console.log(error.response);
            const {violations} = error.response.data; // On récup les erreurs (violations)
            // Si il y a des violations
            if(violations){
                // On boucle sur nos violations (erreurs)
                violations.forEach(violation => {
                    // On donne à notre objet apiErrors un nos erreurs en propriété
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors); // On met nos erreur dans le setErrors
            };

            toast.error("Des erreurs dans votre formulaires !"); // Utilisation de la libraire "Toastify" pour l'affichage d'une notification à l'utilisateur
        }

        //console.log(user); // Affiche un objet qui contient les infos envoyées dans le formulaire sur le user
    }

    return ( 
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit} >

                <Field_Autofocus
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />

                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />

                <Field
                    name="email"
                    label="Adresse email"
                    placeholder="Votre adresse email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />

                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />

                <Field
                    name="passwordConfirm"
                    label="Confirmation du mot de passe"
                    type="password"
                    placeholder="Confirmation de votre mot de passe"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />

                <div className="form-group mt-4">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déja un compte</Link>
                </div>

            </form>
        </>
     );
}
 
export default RegisterPage;
