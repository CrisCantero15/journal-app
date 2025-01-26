import { authSlice, checkingCredentials, login, logout } from "../../../src/store/auth";
import { authenticatedState, demoUser, initialState } from "../../helpers/fixtures/authFixtures";

describe('Pruebas en authSlice', () => {

    test('Debe regresar el estado inicial y llamarse "auth"', () => {

        // console.log( authSlice );

        expect( authSlice.name ).toBe( 'auth' );

        const state = authSlice.reducer( initialState, {} ); // Mando al reducer el estado inicial, así que esta función hace que el Slice tome ese estado
        // console.log( state );

        expect( state ).toEqual( initialState );
        expect( authSlice.getInitialState() ).toEqual( initialState ); // Más apropiado porque verificas realmente el estado inicial marcado dentro del Slice

    });

    test('Debe realizar la autenticación', () => {

        // console.log( login( demoUser ) );
        const state = authSlice.reducer( initialState, login( demoUser ) ); // Parámetros: state - action (recuerda el funcionamiento del todoReducer). El demoUser es el payload
        // console.log( state );

        expect( state ).toEqual({
            status: 'authenticated', // 'checking', 'not-authenticated', 'authenticated'
            uid: demoUser.uid,
            email: demoUser.email,
            displayName: demoUser.displayName,
            photoURL: demoUser.photoURL,
            errorMessage: null
        });

    });

    test('Debe realizar el logout', () => {

        // authenticatedState // logout sin argumentos

        const state = authSlice.reducer( authenticatedState, logout() );

        expect( state ).toEqual({
            status: 'not-authenticated',
            uid: null,
            email: null,
            displayName: null,
            photoURL: null,
            errorMessage: undefined
        });

    });

    test('Debe realizar el logout y mostrar un mensaje de error', () => {

        // authenticatedState // logout con argumentos

        const errorMessage = 'Credenciales no son correctas';
        const state = authSlice.reducer( authenticatedState, logout({ errorMessage }) );

        expect( state ).toEqual({
            status: 'not-authenticated',
            uid: null,
            email: null,
            displayName: null,
            photoURL: null,
            errorMessage: errorMessage
        });

    });

    test('Debe cambiar el estado a "checking"', () => {

        const state = authSlice.reducer( authenticatedState, checkingCredentials() );

        expect( state.status ).toBe( 'checking' );

    });

});