import { Button, Grid, TextField, Typography, Link, Alert } from "@mui/material"
import { AuthLayout } from "../layout/AuthLayout"
import { Link as RouterLink } from "react-router-dom"
import { useForm } from "../../hooks";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startCreatingUserWithEmailPassword } from "../../store/auth";

const formData = {
    email: '',
    password: '',
    displayName: ''
};

const formValidations = {
    email: [ (value) => value.includes('@'), 'El correo debe tener un @.' ],
    password: [ (value) => value.length >= 6, 'El password debe tener más de 6 letras.' ],
    displayName: [ (value) => value.length >= 1, 'El nombre es obligatorio.' ]
}; // Objeto que contiene los campos del formulario que queremos validar con las funciones de validación

export const RegisterPage = () => {
    
    const dispatch = useDispatch();
    const [ formSubmitted, setFormSubmitted ] = useState( false );
    const { status, errorMessage } = useSelector( state => state.auth );
    const isCheckingAuthentication = useMemo( () => status === 'checking', [ status ] );
    
    const {
        formState, displayName, email, password, onInputChange,
        isFormValid, displayNameValid, emailValid, passwordValid
    } = useForm( formData, formValidations );

    const onSubmit = ( event ) => {
        event.preventDefault();
        setFormSubmitted( true );
        if ( !isFormValid ) return;
        dispatch( startCreatingUserWithEmailPassword( formState ) );
    };
     
    return (
        <AuthLayout title="Register">
            <form onSubmit={ onSubmit } className="animate__animated animate__fadeIn animate__faster">
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <TextField 
                            label="Nombre completo"
                            type="text"
                            placeholder="Tu nombre"
                            name="displayName"
                            value={ displayName }
                            onChange={ onInputChange }
                            fullWidth
                            error={ !!displayNameValid && formSubmitted }
                            helperText={ displayNameValid }
                        />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <TextField 
                            label="Correo"
                            type="email"
                            placeholder="correo@google.com"
                            name="email"
                            value={ email }
                            onChange={ onInputChange }
                            fullWidth
                            error={ !!emailValid && formSubmitted }
                            helperText={ emailValid }
                        />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <TextField 
                            label="Contraseña"
                            type="password"
                            placeholder="Contraseña"
                            name="password"
                            value={ password }
                            onChange={ onInputChange }
                            fullWidth
                            error={ !!passwordValid && formSubmitted }
                            helperText={ passwordValid }
                        />
                    </Grid>
                    <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                        <Grid item xs={ 12 } sm={ 12 } display={ !!errorMessage ? '' : 'none' }> 
                            <Alert severity="error">{ errorMessage }</Alert>
                        </Grid>
                        <Grid item xs={ 12 } sm={ 12 }> 
                            <Button
                                disabled={ isCheckingAuthentication }
                                type="submit" 
                                variant="contained" 
                                fullWidth
                            >
                                Crear cuenta
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="end">
                        <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
                        <Link component={ RouterLink } color="inherit" to="/auth/login">
                            Ingresar
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}
