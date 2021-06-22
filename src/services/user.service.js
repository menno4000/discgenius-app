import axios from 'axios';

const API_URL = 'http://localhost:9001/auth/';

export const userService = {
    login,
    logout,
    register
};

function login(user){
    const formData = new FormData();
    formData.append('email', user.email)
    formData.append('password', user.password)
    return axios
        .post(API_URL+'jwt/login', {
            email: user.email,
            password: user.password
        }).then(response => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify())
            }
            return response.data;
        });
}
function logout() {
    localStorage.removeItem('user');
}
function register(user){
    return axios.post(API_URL+'/register', {
        email: user.email,
        password: user.password
    });
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}