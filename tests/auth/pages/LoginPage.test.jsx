import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { authSlice } from "../../../src/store/auth";
import { startGoogleSingIn, startLoginWithEmailPassword } from "../../../src/store/auth/thunks";
import { LoginPage } from "../../../src/auth/pages/LoginPage";
import { notAuthenticatedState } from '../../helpers/fixtures/authFixtures'

const mockStartGoogleSignIn = jest.fn(); // Importante el 'mock' al principio del nombre
const mockStartLoginWithEmailPassword = jest.fn();

jest.mock('../../../src/store/auth/thunks', () => ({
    startGoogleSingIn: () => mockStartGoogleSignIn,
    startLoginWithEmailPassword: ({ email, password }) => {
        return () => mockStartLoginWithEmailPassword({ email, password }); // Nos aseguramos de que startLoginEmailPassword haya sido llamado con email y password de argumentos
    }
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'), // Regresamos todas las funciones de 'react-redux'
    useDispatch: () => ( fn ) => fn() // Cuando se llame al useDispatch, retorna una función que a su vez hace el llamado a otra función (exactamente lo que pasa en el dispatch de un thunk)
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer // Es el único que vamos a necesitar en las pruebas a LoginPage
    },
    preloadedState: {
        auth: notAuthenticatedState // Necesitamos establecer el estado en 'not-authenticated' para habilitar ciertos elementos en LoginPage, como el Button de Google
    }
});

describe('Pruebas en <LoginPage />', () => {

    beforeEach( () => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', () => {

        render(
            <Provider store={ store }>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );

        // screen.debug();

        expect( screen.getAllByText( 'Login' ).length ).toBeGreaterThanOrEqual( 1 );

    });

    test('Botón de Google debe llamar el startGoogleSignIn', () => {

        render(
            <Provider store={ store }>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );

        const googleBtn = screen.getByLabelText( 'google-btn' ); // Obtenemos la referencia al botón señalando al atributo identificador 'aria-label'
        fireEvent.click( googleBtn );

        expect( mockStartGoogleSignIn ).toHaveBeenCalled();

    });

    test('Submit debe llamar el startLoginWithEmailPassword', () => {

        const email = 'cristian@google.com';
        const password = '123456';

        render(
            <Provider store={ store }>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );

        const emailField = screen.getByRole( 'textbox', { name: 'Correo' } );
        fireEvent.change( emailField, { target: { name: 'email', value: email } } );

        const passwordField = screen.getByTestId( 'password' );
        fireEvent.change( passwordField, { target: { name: 'password', value: password } } );

        const loginForm = screen.getByLabelText( 'submit-form' );
        fireEvent.submit( loginForm );

        expect( mockStartLoginWithEmailPassword ).toHaveBeenCalledWith({
            email: email,
            password: password
        });

    });

});