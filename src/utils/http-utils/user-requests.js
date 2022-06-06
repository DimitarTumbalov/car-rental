import axios from 'axios';

const apiUrl = 'http://localhost:3005/users'
const loggedUserKey = 'loggedUser';

export function getLoggedUser() {
    return JSON.parse(localStorage.getItem(loggedUserKey));
}

export function saveUserToLocalStorage(user) {
    user.password = null;
    localStorage.setItem(loggedUserKey, JSON.stringify(user));
}

export function deleteUser(id) {
    return axios.delete(`${apiUrl}/${id}`);
}

export function saveUser(user) {
    if (user.id) {
        return axios.put(`${apiUrl}/${user.id}`, user);
    }

    return axios.post(`${apiUrl}`, user);
}

export async function registerUser(user) {
    const existingUsersEmail = (await axios.get(`${apiUrl}?email=${user.email}`)).data;
    const existingUsersPhone = (await axios.get(`${apiUrl}?phone=${user.phone}`)).data;

    if (existingUsersEmail.length > 0)
        throw new Error('User with this email already exists.');

    if(existingUsersPhone.length > 0)
        throw new Error('User with this phone number already exists.');

    return saveUser(user);
}

export function getAllUsers(){
    return axios.get(apiUrl);
}

export function getUserById(id){
    return axios.get(`${apiUrl}/${id}`)
}

export async function login(user) {
    const allUsers = (await getAllUsers()).data;

    const foundUser = allUsers.find(u => u.email === user.email && u.password === user.password);

    if (!foundUser)
        throw new Error('Invalid username/password');

    saveUserToLocalStorage(foundUser);

    return foundUser;
}

export async function logout() {
    localStorage.removeItem(loggedUserKey);
}