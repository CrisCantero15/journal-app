import { createSlice } from '@reduxjs/toolkit';

export const journalSlice = createSlice({
    name: 'journal',
    initialState: {
        isSaving: false,
        messageSaved: '', // Cuando se guarda la nota (actualización), colocamos un valor aquí
        notes: [],
        active: null
        // active: {
        //     id: 'ABC123',
        //     title: '',
        //     body: '',
        //     date: 1234567,
        //     imgUrls: [], // https://foto1.jpg, https://foto2.jpg, https://foto3.jpg
        // }
    },
    reducers: {
        savingNewNote: ( state ) => {
            state.isSaving = true;
        },
        addNewEmptyNote: ( state, { payload } ) => { // Al pusar el botón de (+) se añade una nueva entrada
            state.notes.push( payload );
            state.isSaving = false;
        },
        setActiveNote: ( state, { payload } ) => { // Elegir la nota que se va a mostrar
            state.active = payload;
            state.messageSaved = '';
        },
        setNotes: ( state, { payload } ) => { // Establecer las notas en el STORE al recargar la página o iniciar sesión
            state.notes = payload;
        },
        setSaving: ( state, action ) => { // Guardar una nota
            state.isSaving = true;
            state.messageSaved = '';
        },
        updateNote: ( state, { payload } ) => { // Actualizar una nota en la referencia local (store) después de haber guardado la actualización de la nota en Firestore
            state.isSaving = false;
            state.notes = state.notes.map( note => {
                if ( note.id === payload.id ) return payload;
                return note;
            });
            state.messageSaved = `'${ payload.title }' se ha actualizado correctamente.`;
        },
        setPhotosToActiveNote: ( state, { payload } ) => { // Actualizamos la nota activa con las fotos insertadas
            state.active.imgUrls = [ ...state.active.imgUrls, ...payload ];
            state.isSaving = false;
        },
        clearNotesLogout: ( state ) => {
            state.isSaving = false;
            state.messageSaved = '';
            state.notes = [];
            state.active = null;
        },
        deleteNoteById: ( state, { payload } ) => { // Eliminar una nota por ID
            state.notes = state.notes.filter( note => payload !== note.id );
            state.active = null;
        }
    }
});


// Action creators are generated for each case reducer function
export const {
    addNewEmptyNote,
    clearNotesLogout,
    deleteNoteById,
    savingNewNote,
    setActiveNote,
    setNotes,
    setPhotosToActiveNote,
    setSaving,
    updateNote
} = journalSlice.actions;