/*
    Fichier de config pour centraliser toutes les url de notre application
*/

export const API_URL = process.env.API_URL; // "process.env" permet de dire à NodeJS qu'ici on a une variable d'environnement et que c'est "API_URL"
//export const API_URL = "http://localhost:8000/api/"; // L'Url de notre api

export const CUSTOMERS_API = API_URL + "customers";
export const INVOICES_API = API_URL + "invoices";
export const USERS_API = API_URL + "users";
export const LOGIN_API = API_URL + "login_check";