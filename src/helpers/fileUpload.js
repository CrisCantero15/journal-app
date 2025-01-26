export const fileUpload = async ( file ) => {

    // if ( !file ) throw new Error( 'No tenemos ningún archivo a subir.' );

    if ( !file ) return null;

    const cloudUrl = 'https://api.cloudinary.com/v1_1/drmw8lrst/upload';

    // Preparamos el formData que incluye la configuración preestablecida de subida y los archivos a subir

    const formData = new FormData();
    formData.append( 'upload_preset', 'react-journal' );
    formData.append( 'file', file );

    try {
        
        const resp = await fetch( cloudUrl, {
            method: 'POST', // Método POST, si no indicamos nada por defecto inicia una petición GET
            body: formData // Cuerpo de la petición POST
        });

        // console.log( resp );
        if( !resp.ok ) throw new Error( 'No se pudo subir la imagen.' );

        const cloudResp = await resp.json();
        // console.log( cloudResp );

        return cloudResp.secure_url; // En la propiedad 'secure_url' obtenemos la URL de la imagen subida a Cloudinary

    } catch ( error ) {
        
        // console.log( error );
        // throw new Error( error.message );
        return null;

    }

}