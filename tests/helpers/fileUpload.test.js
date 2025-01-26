import { fileUpload } from "../../src/helpers";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'drmw8lrst',
    api_key: '291282696628962',
    api_secret: 'VslPCotGVIiSp5gSviIb_n-6-D8',
    secure: true
});

describe('Pruebas en fileUpload', () => {

    test('Debe subir el archivo correctamente a Cloudinary', async () => {

        const imageUrl = 'https://plus.unsplash.com/premium_photo-1668024966086-bd66ba04262f?q=80&w=2092&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        const resp = await fetch( imageUrl );
        const blob = await resp.blob(); // Convertimos la imagen a tipo binario (blob) para poder convertirla en un archivo local
        const file = new File([ blob ], 'foto.jpg'); // Convertimos la imagen de tipo binario en un objeto de tipo File (similar a un archivo real de un sistema de archivos del PC)

        const url = await fileUpload( file );
        expect( typeof url ).toBe( 'string' );

        // Eliminamos la imagen con el SDK de Cloudinary para Node.js (recuerda que las pruebas son parte del backend)

        // console.log( url );

        const segments = url.split('/');
        // console.log( segments );
        const imageId = segments[ segments.length - 1 ].replace('.jpg', ''); // Obtenemos el url de la última posición del Array y reemplazamos la extensión (.jpg en este caso) por una cadena de texto vacía

        await cloudinary.api.delete_resources([ imageId ]);

    });

    test('Debe retornar null', async () => {
        
        const file = new File([], 'foto.jpg');

        const url = await fileUpload( file );
        expect( url ).toBe( null );

    });

});