import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, signInWithGoogle } from "../../firebase/providers";
import { clearNotesLogout } from "../journal";
import { checkingCredentials, login, logout } from "./"

export const checkingAuthentication = () => {
    return async ( dispatch ) => {
        dispatch( checkingCredentials());
    }
}

export const startGoogleSingIn = () => {
    return async ( dispatch ) => {
        dispatch( checkingCredentials() );
        const result = await signInWithGoogle();
        if ( !result.ok ) return dispatch( logout( result.errorMessage ) );
        dispatch( login( result ) );
    }
}

export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {
    return async ( dispatch ) => {
        dispatch( checkingCredentials() );
        const { ok, uid, photoURL, errorMessage } = await registerUserWithEmailPassword({ email, password, displayName });
        if ( !ok ) return dispatch( logout({ errorMessage }) );
        dispatch( login({ uid, displayName, email, photoURL }) );
    }
}

export const startLoginWithEmailPassword = ({ email, password }) => {
    return async ( dispatch ) => {
        dispatch( checkingCredentials() );
        const resp = await loginWithEmailPassword({ email, password });
        const { ok, displayName, photoURL, uid, errorMessage } = resp;
        if ( !ok ) return dispatch( logout({ errorMessage }) );
        dispatch( login({ uid, email, displayName, photoURL }) );
    }
}

export const startLogout = () => {
    return async ( dispatch ) => {
        await logoutFirebase();
        dispatch( clearNotesLogout() );
        dispatch( logout() );
    }
}