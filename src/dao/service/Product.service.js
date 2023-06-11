//Servicio de productos
import { ProductModel } from '../models/product.model.js';
const LIMITdEFAULT = 10;
const PAGEdEFAULT = 1;

class ProductService {
	constructor() {
		this.model = ProductModel;
	}

	//Método para traer todos los productos de la base de datos
	async getProducts(limit = LIMITdEFAULT, page = PAGEdEFAULT, category = false, sort = false, availability = false) {
		let query = {};
		let options = {
			limit: limit,
			page: page,
			lean: true,
		};
		let link = '';

		if (category) {
			query = { ...query, category };
			link += `&category=${category}`;
		}
		if (availability) {
			query = { ...query, availability };
			link += `&availability=${availability}`;
		}
		if (sort) {
			options = { ...options, sort: { price: sort } };
			link += `&sort=${sort}`;
		}

		let products = await this.model.paginate(query, options);
		let returnProducts = {
			status: 'success',
			payload: products.docs,
			totalPages: products.totalPages,
			prevPage: products.prevPage,
			nextPage: products.nextPage,
			page: products.page,
			hasPrevPage: products.hasPrevPage,
			hasNextPage: products.hasNextPage,
			prevLink: !products.hasPrevPage ? null : `?limit=${limit}&page=${products.prevPage}` + link, //
			nextLink: !products.hasNextPage ? null : `?limit=${limit}&page=${products.nextPage}` + link, //
		};

		return returnProducts;
	}

	//Método para agregar productos a la base de datos
	async addProducts(productToAdd) {
		if (
			!productToAdd.title ||
			!productToAdd.description ||
			!productToAdd.code ||
			!productToAdd.price ||
			!productToAdd.status ||
			!productToAdd.stock ||
			!productToAdd.category ||
			!productToAdd.thumbnail
		) {
			return { error: 'Error: fields missing' }; //Si falta algun campo, arrojo error
		}
		let products = await this.model.find().lean();

		let codes = products.map((cod) => cod.code); // me quedo con todos los códigos del array productos
		//evaluo si el codigo del nuevo producto no existe
		if (!codes.includes(productToAdd.code)) {
			await this.model.create(productToAdd);
			return { status: 'sucess', message: `product ${productToAdd.code} created` };
		} else {
			return { error: 'Error: product already exist' }; //Si el producto ya existe arrojo error
		}
	}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
		const result = this.model.find({ _id: idBuscado }); // busco el elemento que coincida con el ID indicado

		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result;
		} else {
			return { error: 'Error: Product not found' };
		}
	}

	//Método para actualizar producto
	async updateProduct(idBuscado, productUpdated) {
		if (!idBuscado) {
			return { error: 'Error: field ID is missing' };
		}
		await this.model.updateOne({ _id: idBuscado }, productUpdated);
		return { status: 'sucess', message: `product ID:${idBuscado} Updated` };
	}

	//Método para eliminar un producto del archivo
	async deleteProduct(idBuscado) {
		let result = await this.model.find({ _id: idBuscado });

		if (result.length == 0) {
			return { error: 'Error: Product not found' }; //si no encuentro producto retorno error
		}

		let deleted = this.model.deleteOne({ _id: idBuscado }); //elimino producto seleccionado
		if ((await deleted).acknowledged) {
			return { status: 'sucess', message: `product ID:${idBuscado} deleted` }; //retorno sucess con el producto eliminado
		}
	}
}

const ProductListDb = new ProductService();

export default ProductListDb;