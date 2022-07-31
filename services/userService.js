import axios from 'axios';
const baseUrl = 'http://192.168.1.131:3000';

const getUsers = ()=>{
    // Invoking get method to perform a GET request
    return axios.get(`${baseUrl}/users`)
}
export {
    getUsers
};