import { useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"

import { DeleteOutline, SaveOutlined, UploadOutlined } from "@mui/icons-material"
import { Button, Grid, IconButton, TextField, Typography } from "@mui/material"
import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.css"

import { ImageGallery } from "../components"
import { useForm } from "../../hooks"
import { setActiveNote, startDeletingNotes, startUploadingFiles, startSaveNote } from "../../store/journal"

export const NoteView = () => {
    
    const dispatch = useDispatch();
    const { active: note, messageSaved, isSaving } = useSelector( state => state.journal );

    const { body, title, date, onInputChange, formState } = useForm( note ); // En useForm creamos un efecto secundario que se lanza cada vez que cambia 'note' para que así se actualicen los valores del campo del formulario con la nota activa
    
    const dateString = useMemo(() => {
        const newDate = new Date( date );
        return newDate.toUTCString();
    }, [ date ]);

    const fileInputRef = useRef();

    useEffect(() => {
        dispatch( setActiveNote( formState ) );
    }, [ formState ]);

    useEffect(() => { // Cada vez que se actualiza el valor de 'messageSaved' (al actualizarse los valores de una nota) se lanza el efecto secundario de una alerta de Swal
        if( messageSaved.length > 0 ) {
            Swal.fire('Nota actualizada', messageSaved, 'success');
        }
    }, [ messageSaved ]);

    const onSaveNote = () => {
        dispatch( startSaveNote() );
    }

    const onFileInputChange = ({ target }) => {
        if ( target.files === 0 ) return;
        // console.log( 'Subiendo archivos' );
        dispatch( startUploadingFiles( target.files ) );
    }

    const onDelete = () => {
        dispatch( startDeletingNotes() );
    }

    return (
        <Grid container className="animate__animated animate__fadeIn animate__faster" direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Grid item>
                <Typography fontSize={ 39 } fontWeight="light">{ dateString }</Typography>
            </Grid>
            <Grid item>
                <input 
                    type="file"
                    multiple
                    ref={ fileInputRef }
                    onChange={ onFileInputChange }
                    style={{ display: 'none' }}
                />
                <IconButton
                    color="primary"
                    disabled={ isSaving }
                    onClick={ () => fileInputRef.current.click() }
                >
                    <UploadOutlined />
                </IconButton>
                <Button
                    disabled={ isSaving }
                    onClick={ onSaveNote }
                    color="primary" 
                    sx={{ padding: 2 }}
                >
                    <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
                    Guardar
                </Button>
            </Grid>
            <Grid container>
                <TextField 
                    type="text"
                    variant="filled"
                    fullWidth
                    placeholder="Ingrese un título"
                    label="Título"
                    sx={{ border: 'none', mb: 1 }}
                    name="title"
                    value={ title }
                    onChange={ onInputChange }
                />
                <TextField 
                    type="text"
                    variant="filled"
                    fullWidth
                    multiline
                    placeholder="¿Qué sucedió en el día de hoy?"
                    minRows={ 5 }
                    name="body"
                    value={ body }
                    onChange={ onInputChange }
                />
            </Grid>
            <Grid container justifyContent="end">
                <Button
                    onClick={ onDelete }
                    sx={{ mt: 2 }}
                    color="error"
                >
                    <DeleteOutline />
                </Button>
            </Grid>
            <ImageGallery images={ note.imgUrls } />
        </Grid>
    )
}
