export const getEnvironments = () => {
    
    import.meta.env; // Importar las variables de entorno (Vite)

    return {
        ...import.meta.env
    }

}