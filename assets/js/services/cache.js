/*
    Système de mise en cache (pour éviter à l'app de recharger les données reçues)
*/

const cache = {};

// Setter de notre système de cache
function set(key, data){
    cache[key] = {
        data,
        cachedAt: new Date().getTime() // "getTime()" donne un timestamp sur la date actuelle
    };
}

// Getter de notre systeme de cache
function get(key){
    // On retourne un objet "Promise" qui est une promesse de réponse de requête http asynchrone
    return new Promise((resolve) =>{

        // La promesse va retourner :
        resolve(
            // CONDITION TERNAIRE
            // Si "cache[key]" existe Et si "cache[key].cachedAt" en miliseconde + 15 minutes et supérieur au timestamp actuel alors...
            // on retourne "cache[key].data" sinon on retourn null
            cache[key] && cache[key].cachedAt + 15 * 60 * 1000 > new Date().getTime() ? cache[key].data : null
        );
 
    });
}

export default {
    set, 
    get
};