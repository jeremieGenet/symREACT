import React from 'react';

const Select = ({ name, value, label, onChange, error="", children}) => { // children est une propriété des composants REACT qui permet de représenter tout ce qui se trouve entre les balises ouvrantes et fermantes du composant (ice les options)
    return ( 
        <>
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                <select 
                    onChange={onChange} 
                    name={name} 
                    id={name}
                    value={value}
                    className={"form-control" + (error && " is-invalid")} // CONDITION si il y a une erreur on ajoute la classe " is-invalid"
                >
                    {/* children est une propriété des composants REACT qui permet de représenter tout ce qui se trouve entre les balises ouvrantes et fermantes du composant (ice les options) */}
                    {children}
                </select>
            </div>
            <p className="invalid-feedback">{error}</p>
        </>
     );
};
 
export default Select;
