import { collection, getDocs } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";

export const loadNotes = async ( uid = '' ) => {

    if ( !uid ) throw new Error('El UID del usuario no existe.');

    const collectionRef = collection( FirebaseDB, `${ uid }/journal/notes` ); // Obtenemos la referencia a la colección 'notes' de nuestra BBDD
    const docs = await getDocs( collectionRef ); // En 'docs' solo tenemos la referencia a los documentos. Para obtener los documentos tenemos que llamar

    const notes = [];

    docs.forEach( doc => {
        notes.push({ id: doc.id, ...doc.data() })
    });

    return notes;

}