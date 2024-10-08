const fs = require('fs').promises

class ProductManager {
    constructor(path) {
        this.products = []
        this.path = path
        this.lastId = 0

        this.loadProducts()
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            this.products = JSON.parse(data)
            if (this.products.length > 0) {
                this.lastId = Math.max(...this.products.map(product => product.id))
            }
        } catch (error) {
            console.error("Error loading products from the file", error)

            await this.saveProducts()
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 4))
        } catch (error) {
            console.error("Error saving the file", error)
        }
    }

    async addProduct(newObject) {
        try {
            let { title, description, category, price, thumbnail, code, stock, status } = newObject


            if (!title || !description || !category || !price || !thumbnail || !code || !stock || status == undefined || status == null) {
                console.error("All fields are mandatory.")
                return
            }


            if (this.products.some(product => product.code === code)) {
                console.error("A product with that code already exists.")
                return
            }


            const newProduct = {
                id: ++this.lastId,
                title,
                description,
                category,
                price: parseFloat(price),
                thumbnail,
                code,
                stock: parseInt(stock),
                status: JSON.parse(status) 
            }
            this.products.push(newProduct)
            console.log("Product added:", newProduct)

            await this.saveProducts(this.products)
        } catch (error) {
            console.error("Error adding the product:", error)
            return { error: "Internal Server Error" }
        }
    }

    async getProducts() {
        return this.products
    }

    async getProductById(id) {
        try {
            const foundProduct = this.products.find(item => item.id === id)
            if (!foundProduct) {
                console.error(`A product with the id ${id} was not found.`)
            } else {
                console.log("Product found:", foundProduct)
                return foundProduct
            }
        } catch (error) {
            console.error("Error reading the file", error)
        }
    }

    async updateProduct(id, updatedProduct) {
        try {

            const index = this.products.findIndex(product => product.id === id)
            if (index !== -1) {

                this.products.splice(index, 1, { id: id, ...updatedProduct })
                await this.saveProducts(this.products)
                console.log("Product updated:", updatedProduct)
            } else {
                console.error(`A product with the id ${id} was not found.`)
            }
        } catch (error) {
            console.error("Error updating the product", error)
        }
    }

    async deleteProduct(id) {
        try {

            const index = this.products.findIndex(product => product.id === id)
            if (index !== -1) {

                const deletedProduct = this.products.splice(index, 1)
                await this.saveProducts(this.products)
                console.log("Product deleted:", deletedProduct)
            } else {
                console.error(`A product with the id ${id} was not found.`)
            }
        } catch (error) {
            console.error("Error deleting the product", error)
        }
    }

    async getProductsLimit(limit) {
        if (limit) {
            return this.products.slice(0, limit)
        }
        return this.products
    }
}

module.exports = ProductManager