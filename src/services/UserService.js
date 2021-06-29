import axios from 'axios';

const API_URL = 'http://localhost:9001/auth/';

export default {
    login,
    logout,
    register
};

function login(username, password){
    const formData = new FormData();
    formData.append('username', username)
    formData.append('password', password)
    return axios
        .post(API_URL+'jwt/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            return response
        });
}
function logout() {
    localStorage.removeItem('user');
}
function register(user){
    return axios.post(API_URL+'/register', {
        email: user.email,
        password: user.password
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));
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