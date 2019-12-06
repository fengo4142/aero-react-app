import React, { createContext, useReducer } from  'react';
// import jwtDecode from 'jwt-decode';

const inititalState = {
    user: null,
    jwtToken: null
}

// if(localStorage.getItem("jwtToken")){
//     const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

//     if(decodedToken.exp * 1000 < Date.now()){
//         localStorage.removeItem("jwtToken");
//     } else {
//         inititalState.user = decodedToken;
//     }
// }
console.log(localStorage.getItem("jwtToken"));

if(localStorage.getItem("jwtToken")){
    inititalState.jwtToken  = localStorage.getItem("jwtToken");
    inititalState.user      = JSON.parse(localStorage.getItem("userDetails"));
}

const AuthContext = createContext({
    user: null,
    jwtToken: null,
    login: (userData) => {},
    logout: () => {}
})

function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                jwtToken: action.payload.userId
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null,
                jwtToken: null
            }
        default:
            return state;
    }
}

function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, inititalState);

    function login (userData) {
        localStorage.setItem("jwtToken", userData.userId);
        localStorage.setItem("userDetails", JSON.stringify(userData));
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    function logout(){
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userDetails");
        dispatch({
            type: 'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, jwtToken: state.jwtToken, login, logout }}
            {...props}
            />
    )
}

export {
    AuthContext,
    AuthProvider
}