import axios from "axios";
import { appConfig } from "../config";
import { parseJwt } from "../helpers";


export async function register(fname: string, lname: string, email: string, password: string) {
    const url = appConfig.url + "register";

    const data = {
        firstName: fname,
        lastName: lname,
        email,
        password,
    }
    const res = await axios.post(url, data)

    const token = res.data

    localStorage.setItem("token", token)
    return token;
}

export async function login(email: string, password: string) {
    const url = appConfig.url + "login";
    const res = await axios.post(url, { email, password })

    const token = res.data;
    const parsedToken = parseJwt(token);

    localStorage.setItem("token", token)

    return parsedToken.user;
}