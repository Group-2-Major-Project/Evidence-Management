import { API_LOGIN, API_REGISTER, HTTP_HEADER } from './Constants.js';

const Login = async (user) => {
    try {
        const resp = await fetch(API_LOGIN, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify(user),
        })
        const userstr = await resp.text()
        if (resp.status === 200) {
            localStorage.setItem('user', userstr);
        }

        return userstr
    } catch (error) {
        return error;
    }
}

const CreateNewUser = async (user) => {
    try {
        const resp = await fetch(API_REGISTER, {
            headers: HTTP_HEADER(),
            method: 'POST',
            body: JSON.stringify(user),
        })
        const userstr = await resp.text()
        return userstr
    } catch (error) {
        return error;
    }
}

const IsLogin = () => {
    const user = localStorage.getItem('user');
    return (JSON.parse(user).isUserLogin);
}

const GetJWT = () => {
    const user = localStorage.getItem('user');
    return (JSON.parse(user).jwt);
}

const UserServices = {
    Login,
    CreateNewUser,
    IsLogin,
    GetJWT
}

export default UserServices