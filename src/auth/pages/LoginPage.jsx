import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import iconsImport from './iconsImport';
import { AuthLayout } from '../layout/AuthLayout';
import { useForm } from '../../hooks';
import { startGoogleSingIn, startLoginWithEmailPassword } from '../../store/auth';

const { Google, Alert, Button, Grid, Link, TextField, Typography } = iconsImport;

const formData = {
    email: '',
    password: ''
};

export const LoginPage = () => {
    
    const { status, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const { email, password, onInputChange } = useForm( formData );

    const isAuthenticating = useMemo( () => status === 'checking', [ status ] );

    const onSubmit = ( event ) => {
        event.preventDefault();
        dispatch( startLoginWithEmailPassword({ email, password }) );
    }

    const onGoogleSingIn = () => {
        console.log('onGoogleSingIn');
        dispatch( startGoogleSingIn() );
    }
    
    return (
        <AuthLayout title="Login">
            <form onSubmit={ onSubmit } className="animate__animated animate__fadeIn animate__faster" aria-label="submit-form">
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <TextField 
                            label="Correo"
                            type="email"
                            placeholder="correo@google.com"
                            fullWidth
                            name="email"
                            value={ email }
                            onChange={ onInputChange }
                        />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2 }}>
                        <TextField 
                            label="Contraseña"
                            type="password"
                            placeholder="Contraseña"
                            fullWidth
                            name="password"
                            inputProps={{
                                'data-testid': 'password' // Mandamos al <input> que genera este <TextField> props para que define un atributo 'data-testid' con valor de 'password' (útil en Testing)
                            }}
                            value={ password }
                            onChange={ onInputChange }
                        />
                    </Grid>
                    <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                        <Grid item xs={ 12 } sm={ 12 } display={ !!errorMessage ? '' : 'none' }> 
                            <Alert severity="error">{ errorMessage }</Alert>
                        </Grid>
                        <Grid item xs={ 12 } sm={ 6 }> 
                            <Button
                                disabled={ isAuthenticating }
                                type="submit" 
                                variant="contained" 
                                fullWidth
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={ 12 } sm={ 6 }> 
                            <Button
                                disabled={ isAuthenticating }
                                onClick={ onGoogleSingIn }
                                variant="contained"
                                fullWidth
                                aria-label="google-btn" // Nos sirve para tomar el botón en la parte de pruebas
                            >
                                <Google />
                                <Typography sx={{ ml: 1 }}>Google</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justifyContent="end">
                        <Link component={ RouterLink } color="inherit" to="/auth/register">
                            Crear una cuenta
                        </Link>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    )
}
