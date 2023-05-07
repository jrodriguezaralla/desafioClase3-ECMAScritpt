//Desafio Clase 4 - Manejo de archivos en Javascript

import fs from 'fs';

export default class ProductManager {
	static id = 0; // ID que será vistos por todas las instancias

	constructor(myPath) {
		this.products = [];
		this.path = myPath;
		//Si no existe el archivo lo creo de forma sincronica con un array vacío
		if (!fs.existsSync('./datos.json')) {
			fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
		}
	}

	//Método para agregar productos al archivo
	async addProducts(productToAdd) {
		let newProduct = {
			id: ProductManager.id,
			title: productToAdd.title,
			description: productToAdd.description,
			code: productToAdd.code,
			price: productToAdd.price,
			status: true,
			stock: productToAdd.stock,
			category: productToAdd.category,
			thumbnail: productToAdd.thumbnail,
		};

		let codes = this.products.map((cod) => cod.code); // me quedo con todos los códigos del array productos

		//evaluo si el codigo del nuevo producto no existe
		if (!codes.includes(productToAdd.code)) {
			this.products = await this.getProducts();
			this.products.push(newProduct);
			ProductManager.id += 1; //incremento contador ID

			//Si no existe, Escribo el file utilizando promesas y esperando a que se cumpla la misma
			await fs.promises.writeFile(`${this.path}`, JSON.stringify(this.products));
		} else {
			return { error: 'Error: product already exist' };
		}
	}

	//Método para adquirir el listado de productos desde el archivo.
	async getProducts() {
		const actualProducts = await fs.promises.readFile(`${this.path}`, 'utf-8');
		return JSON.parse(actualProducts);
	}

	//Método para adquirir un producto especifico por ID
	async getProductsById(idBuscado) {
		const productList = await this.getProducts();
		const result = productList.find((element) => element.id === idBuscado); // busco el elemento que coincida con el ID indicado

		if (result) {
			// Si tengo un resultado lo retorno, sino devuelvo error
			return result;
		} else {
			return { error: 'Error: Product not found' };
		}
	}

	//Método para actualizar producto
	async updateProduct(idBuscado, productUpdated) {
		const productList = await this.getProducts();
		productList.map((product) => {
			if (product.id === idBuscado) {
				product.title = productUpdated.title;
				product.description = productUpdated.description;
				product.code = productUpdated.code;
				product.price = productUpdated.price;
				product.status = productUpdated.status;
				product.stock = productUpdated.stock;
				product.category = productUpdated.category;
				product.thumbnail = productUpdated.thumbnail;
			}
			return product;
		});

		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productList));
		return productList;
	}

	//Método para eliminar un producto del archivo
	async deleteProduct(idBuscado) {
		const productList = await this.getProducts(); //obtengo lista de productos
		const index = productList.indexOf(productList.find((elemento) => elemento.id === idBuscado)); //obtengo el índice del elemento a borrar

		if (index === -1) return { error: 'Error: Product not found' }; //si no encuentro producto retorno error

		productList.splice(index, 1); // elimino el elemento seleccionado
		await fs.promises.writeFile(`${this.path}`, JSON.stringify(productList)); //reescribo archivo
		return productList; //retorno nuevo listado
	}
}