// En caso de necesitar la implementación del FetchAPI
import 'whatwg-fetch'; // <-- yarn add whatwg-fetch

require('dotenv').config({
    path: '.env.test'
}); // Configuramos 'dotenv' para que automáticamente busque las variables de entorno de forma síncrona en '.env.test'

jest.mock('./src/helpers/getEnvironments', () => ({
    getEnvironments: () => ({ ...process.env }) // Mockeamos el módulo helpers/getEnvironments. La función getEnvironments devolverá todas las variables de entorno actuales (process.env) en el entorno de pruebas
}));