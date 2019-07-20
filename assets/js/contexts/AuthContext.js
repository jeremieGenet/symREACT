import React from 'react';

// "createContext() permet de prendre comme CONTEXTE la forme des informations que l'on veut contextualiser"
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {}
})
