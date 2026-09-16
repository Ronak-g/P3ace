import Client from "./Client";

interface loginData {
    name : string,
    password : string
}

interface registerData extends loginData {
    email : string
}

const registerUser = (data:registerData) => Client.post("/auth/register", data)
const loginUser = (data:loginData) => Client.post("/auth/login", data)
const refreshSession = () => Client.post("/auth/refresh")
const logoutUser = () => Client.post("/auth/logout")

export {
    registerUser,
    loginUser,
    refreshSession,
    logoutUser
}