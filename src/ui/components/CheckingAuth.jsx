import { CircularProgress, Grid } from "@mui/material"

export const CheckingAuth = () => {
    return (
        <Grid container
            spacing={ 0 }
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh', backgroundColor: 'primary.main', padding: 4 }} 
        >
            <Grid item>
                <CircularProgress color="warning" />
            </Grid>
        </Grid>
    )
}
