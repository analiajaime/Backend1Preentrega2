const express = require('express')
const router = express.Router()

module.exports = (cartManager, productManager) => {
    
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.createCart()
            res.json({ newCart })
        } catch (error) {
            console.error("Error creating a new cart", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    
    router.get('/:cid', async (req, res) => {
        const cartId = parseInt(req.params.cid)
        try {
            const cart = await cartManager.getCartById(cartId)
            if (!cart) {
                res.status(400).json({ error: `No cart exists with the id ${cartId}` })
            } else {
                res.json(cart.products)
            }
        } catch (error) {
            console.error("Error retrieving the cart", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    
    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        const quantity = req.body.quantity || 1
        try {
           
            const verifyCartId = await cartManager.getCartById(cartId)
            if(!verifyCartId){
                res.status(400).json({ error: `No cart exists with the id ${cartId}` })
                return cartId
            }

            
            const verifyProductId = await productManager.getProductById(productId)
            if (!verifyProductId) {
                res.status(400).json({ error: `A product with the id ${productId} was not found.` })
                return productId
            }

            const updateCart = await cartManager.addProductToCart(cartId, productId, productManager, quantity)
            res.json(updateCart.products)
        } catch (error) {
            console.error("Error adding a product to the cart", error)
            res.status(500).json({ error: 'Internal Server Error' })
        }
    })

    return router
}