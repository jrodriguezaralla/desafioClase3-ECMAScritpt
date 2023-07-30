//import cartDAO from '../dao/mongoDB/cart.mongo.dao.js';
import { cartDAO } from '../dao/factory.js';
import CartRepository from '../repositories/cart.repository.js';

export default class CartService {
	constructor() {
		this.repository = new CartRepository(cartDAO);
	}

	addNewCart() {
		this.repository.addNewCart();
	}

	//Método para adquirir un carrito especifico por ID
	async getCartById(idBuscado) {
		return await this.repository.getCartById(idBuscado);
	}

	async addProductToCart(cartId, productId) {
		await this.repository.addProductToCart(cartId, productId);
	}

	//Método para borrar un producto del carrito
	async deleteProduct(cartId, productId) {
		await this.repository.deleteProduct(cartId, productId);
	}

	//Método para actualizar todo el array de productos
	async updateAllProducts(cartId, newArray) {
		await this.repository.updateAllProducts(cartId, newArray);
	}

	//metodo para modificar la cantidad de productos de un elemento del array de productos
	async updateProductQuantity(cartId, productId, newQuantity) {
		await this.repository.updateProductQuantity(cartId, productId, newQuantity);
	}

	//Metodo para borrar todos los productos de un carrito determinado
	async deleteAllProducts(cartId) {
		await this.repository.deleteAllProducts(cartId);
	}

	getIndex(cart, productId) {
		return this.repository.getIndex(cart, productId);
	}
}
