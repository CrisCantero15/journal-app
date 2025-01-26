import { collection, deleteDoc, getDocs } from "firebase/firestore/lite";
import { addNewEmptyNote, savingNewNote, setActiveNote, startNewNote } from "../../../src/store/journal";
import { FirebaseDB } from "../../../src/firebase/config";

describe('Pruebas en JournalThunk', () => {

    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach( () => jest.clearAllMocks() );

    test('startNewNote debe crear una nueva nota en blanco', async () => {

        const uid = 'TEST-UID';
        getState.mockReturnValue({ auth: { uid } }); // Como retorna un value, utilizamos el 'mockReturnValue'. Si retornamos una promesa, utilizamos 'mockResolvedValue'

        await startNewNote()( dispatch, getState );

        expect( dispatch ).toHaveBeenCalledWith( savingNewNote() );
        expect( dispatch ).toHaveBeenCalledWith( addNewEmptyNote({
            body: '',
            title: '',
            id: expect.any( String ), // Como no podemos saber el valor exacto, esperamos cualquier String
            date: expect.any( Number ) // Como no podemos saber el valor exacto, esperamos cualquier Number
        }));
        expect( dispatch ).toHaveBeenCalledWith( setActiveNote({
            body: '',
            title: '',
            id: expect.any( String ), // Como no podemos saber el valor exacto, esperamos cualquier String
            date: expect.any( Number ) // Como no podemos saber el valor exacto, esperamos cualquier Number
        }));

        // Borrar de Firebase (por esto es útil tener diferentes BBDD para producción y desarrollo y testing, porque en caso de error esto no afecta a la app de producción y desarrollo)

        const collectionRef = collection( FirebaseDB, `${ uid }/journal/notes` );
        const docs = await getDocs( collectionRef ); // Obtenemos todos los documentos de la colección

        // console.log( docs );

        const deletePromises = [];
        docs.forEach( doc => deletePromises.push( deleteDoc( doc.ref ) ) ); // Añadimos en el Array TODAS las promesas (por resolver, hasta que se ejecuten) de borrar la referencia de nuestros docs en la colección

        await Promise.all( deletePromises ); // Se invoca a todas las Promesas para iniciar el borrado de los documentos de la colección

    });

});