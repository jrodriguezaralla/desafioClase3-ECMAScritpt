//Primer Pre entrega//

//Imports
import express from 'express';
import { productsRouter } from './routers/products.router.js';
import { cartRouter } from './routers/carts.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import path from 'path';
import { viewsRouter } from './routers/views.router.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import { ProductList } from './routers/products.router.js';
import ProductListDb from './service/Product.service.js';

//Inicializo Express
const app = express();

//Monto el servidor en el puerto 8080
const webServer = app.listen(8080, () => {
	console.log('Servidor montado en puerto 8080');
});

//Handlebars
app.engine('handlebars', handlebars.engine()); // Inicializamos el motor de plantillas de Handlebars
app.set('views', path.join(__dirname, 'views')); //indicamos ruta de las views
app.set('view engine', 'handlebars'); //por ultimo, se indica que vamos a utilizar el motor de Handlebars

//seteamos de manera estatica la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

//Middlewares
app.use(express.json()); //Middleware que facilita la conversión en formato json de lo que se reciba por body
app.use(express.urlencoded({ extended: true })); //Middleware para que express pueda reconover los objetos de las request como strings o arrays

//Definición de rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
const messages = [];

// Inicialización de socket.io
const io = new Server(webServer);

// Inicio la conección y envio el listado de productos para rederizarlos en pantalla
io.on('connection', async (socket) => {
	// Envio los mensajes al cliente que se conectó
	socket.emit('messages', messages);

	// Escucho los mensajes enviado por el cliente y se los propago a todos
	socket.on('message', (message) => {
		// Agrego el mensaje al array de mensajes
		messages.push(message);
		// Propago el evento a todos los clientes conectados
		io.emit('messages', messages);
	});
	//cuando se conecta un cliente le envío el listado de productos
	socket.emit('real_time_products', await ProductListDb.getProducts());
});

//Me conecto a la base de datos
mongoose.connect('mongodb+srv://jrodriguezaralla:1234@freecluster.mxzp3zq.mongodb.net/?retryWrites=true&w=majority');

export { io };
