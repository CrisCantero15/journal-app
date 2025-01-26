import { loginWithEmailPassword, logoutFirebase, signInWithGoogle } from "../../../src/firebase/providers";
import { checkingAuthentication, checkingCredentials, login, logout, startGoogleSingIn, startLoginWithEmailPassword, startLogout } from "../../../src/store/auth";
import { clearNotesLogout } from "../../../src/store/journal";
import { demoUser } from "../../helpers/fixtures/authFixtures";

jest.mock("../../../src/firebase/providers"); // Mockeamos todas las funciones retornadas de Firebase/Providers

describe('Pruebas en AuthThunks', () => {

    const dispatch = jest.fn();
    beforeEach( () => jest.clearAllMocks() );

    test('Debe invocar el checkingCredentials', async () => {

        // const valor = checkingCredentials();
        // console.log( valor ); // { type: auth/checkingCredentials, payload: undefined }

        await checkingAuthentication()( dispatch ); // El primer () es el llamado a la función, el segundo () es el llamado a la función de retorno que contiene
        
        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );

    });

    test('startGoogleSingIn debe llamar checkingCredentials y login - Éxito', async () => {

        const loginData = { ok: true, ...demoUser };
        await signInWithGoogle.mockResolvedValue( loginData ); // Trabajamos el mock de la función para que retorne esos valores cuando se invoque en la prueba

        // Thunk

        await startGoogleSingIn()( dispatch );

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( login( loginData ) );

    });

    test('startGoogleSingIn debe llamar checkingCredentials y logout - Error', async () => {

        const loginData = { ok: false, errorMessage: 'Un error en Google' }; // En este caso el ok será false para que "traduzca" que ha habido un fallo en la transmisión
        await signInWithGoogle.mockResolvedValue( loginData );

        await startGoogleSingIn()( dispatch );

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( logout( loginData.errorMessage ) );

    });

    test('startLoginWithEmailAndPassword debe llamar checkingCredentials y login - Éxito', async () => {

        const loginData = { ok: true, ...demoUser };
        const formData = { email: demoUser.email, password: '123456' };

        await loginWithEmailPassword.mockResolvedValue( loginData ); // Simulamos el retorno de la función para que devuelve 'loginData'

        await startLoginWithEmailPassword( formData )( dispatch );

        expect( dispatch ).toHaveBeenCalledWith( checkingCredentials() );
        expect( dispatch ).toHaveBeenCalledWith( login({ ...demoUser }) );

    });

    test('startLogout debe llamar logoutFirebase, clearNotes y logout', async () => {

        await startLogout()( dispatch );

        expect( logoutFirebase ).toHaveBeenCalled();
        expect( dispatch ).toHaveBeenCalledWith( clearNotesLogout() );
        expect( dispatch ).toHaveBeenCalledWith( logout() );

    });

});