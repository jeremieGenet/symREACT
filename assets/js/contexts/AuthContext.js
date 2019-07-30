import React from 'react';

// FICHIER CONTEXTUEL (qui va permet de simplifier le code en définissant un contexte)

// "createContext() permet de prendre comme CONTEXTE la forme des informations que l'on veut contextualiser"
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {}
})
