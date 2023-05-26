import { Router } from 'express';
import { ProductList } from './products.router.js';
import { io } from '../app.js';

const viewsRouter = Router();

//Endpoint que muestra un usuario
viewsRouter.get('/', async (req, res) => {
	try {
		let products = await ProductList.getProducts(); //traigo el listado de productos y los renderizo en home
		res.render('home', {
			products,
			style: 'index.css',
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

//Endpoint que muestra un usuario
viewsRouter.get('/realtimeproducts', async (req, res) => {
	// Inicio la conección y envio el listado de productos para rederizarlos en pantalla
	io.on('connection', async (socket) => {
		//cuando se conecta un cliente le envío el listado de productos
		socket.emit('real_time_products', await ProductList.getProducts());
	});

	try {
		res.render('realTimeProducts', {
			//renderizo los productos en tiempo real
			style: 'index.css',
		});
	} catch (error) {
		res.status(400).send(error);
	}
});

export { viewsRouter };