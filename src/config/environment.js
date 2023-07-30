import dotenv from 'dotenv';
import program from './commander.js';

//defino variable por defecto
let path = '.env.dev';

//recibo por linea de comando las opciones
if (program.opts().mode === 'prod') {
	path = '.env.prod';
}

dotenv.config({ path });

//exporto variables
export default {
	//variables app
	port: process.env.PORT,
	mongoUrl: process.env.MONGO_URL,
	mongoSessionSecret: process.env.MONGO_SESSION_SECRET,
	cookieHash: process.env.COOKIE_HASH,

	//variables de administrador
	adminName: process.env.ADMIN_EMAIL,
	adminPassword: process.env.ADMIN_PASSWORD,

	//variable persitencia
	persistence: process.env.PERSISTENCE,

	//variables passport
	jwtSecret: process.env.JWT_SECRET,
	gitHubClientId: process.env.GITHUB_CLIENT_ID,
	gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
	gitHubClientCallback: process.env.GITHUB_CLIENT_CALLBACK,
};
