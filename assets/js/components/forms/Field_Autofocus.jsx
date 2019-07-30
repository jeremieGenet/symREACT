import React from 'react';

// Composant qui représente un champ de formulaire (avec l'autofocus sur ce champ)
const Field_Autofocus = ({name, label, value="", onChange, type = "text", placeholder, error = ""}) => {
    return ( 
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input 
                value={value}
                onChange={onChange}
                type={type} 
                placeholder={placeholder} 
                name={name} 
                id={name}
                /* 
                    La classe "is-invalid" est une classe Bootstrap qui si elle est présente permet l'affichage de le classe "invalid-feedback",
                    ici elle est ajoutée si il y a une erreur et permet l'affichage du paragraphe suivant
                */
                className={"form-control" + (error && " is-invalid")}
                autoFocus
            />
            {/* ERREUR FORMULAIRE */}
            {/* CONDITION: si il y a une "error" alors on affiche le paragraphe classe = invalid-feedback et le contenu de l'erreur */}
            {error && 
            <p className="invalid-feedback">
                {error}
            </p>}
        </div>
     );
}
 
export default Field_Autofocus;