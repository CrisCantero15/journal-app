import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { FirebaseDB } from '../../firebase/config';
import { addNewEmptyNote, setActiveNote, savingNewNote, setNotes, setSaving, updateNote, setPhotosToActiveNote, deleteNoteById } from './journalSlice';
import { fileUpload, loadNotes } from '../../helpers';

export const startNewNote = () => {
    return async ( dispatch, getState ) => {

        dispatch( savingNewNote() );

        // uid del usuario --> Nos permite saber cómo queremos almacenar la información en nuestra BBDD

        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime()
        }

        const newDoc = doc( collection( FirebaseDB, `${ uid }/journal/notes` ) ); // Se crea una referencia a un documento específico dentro de la colección
        await setDoc( newDoc, newNote ); // Si falla da un error, sino no hace nada (retorna undefined)

        newNote.id = newDoc.id; // Creamos la propiedad ID a la nota

        dispatch( addNewEmptyNote( newNote ) );
        dispatch( setActiveNote( newNote ) );

    }
}

export const startLoadingNotes = () => {
    return async ( dispatch, getState ) => {

        const { uid } = getState().auth;

        if( !uid ) throw new Error('El UID del usuario no existe.');

        const notes = await loadNotes( uid );
        dispatch( setNotes( notes ) );

    }
}

export const startSaveNote = () => {
    return async ( dispatch, getState ) => {

        dispatch( setSaving() );

        const { uid } = getState().auth;
        const { active: note } = getState().journal;

        const noteToFireStore = { ...note };
        delete noteToFireStore.id;

        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note.id }` ); // Referencia al documento que queremos actualizar
        await setDoc( docRef, noteToFireStore, { merge: true } ); // Merge en true: Se mantienen los campos que no estoy mandando en el 'noteToFireStore' pero que sí están en el documento

        dispatch( updateNote( note ) );

    }
}

export const startUploadingFiles = ( files = [] ) => {
    return async ( dispatch ) => {
        
        dispatch( setSaving() );

        // Preparar la subida de los archivos

        // await fileUpload( files[0] );

        const fileUploadPromises = []; // Creamos el Array donde se alojarán las Promesas

        for ( const file of files ) {
            
            fileUploadPromises.push( fileUpload( file ) ); // No se dispara la petición (no se dispara el .then) simplemente se está creando el Array de Promesas

        }

        const photosUrls = await Promise.all( fileUploadPromises ); // Disparamos la petición asíncrona de todas las promesas del Array

        console.log( photosUrls );

        dispatch( setPhotosToActiveNote( photosUrls ) );

    }
}

export const startDeletingNotes = () => {
    return async ( dispatch, getState ) => {

        const { uid } = getState().auth;
        const { active: note } = getState().journal;

        const docRef = doc( FirebaseDB, `${uid}/journal/notes/${ note.id }` );
        await deleteDoc( docRef ); // Se borra de Firebase Database

        dispatch( deleteNoteById( note.id ) ); // Se borra del estado global de la aplicación (tanto de active como de notes)

    }
}