import { generateProducts } from "../utils/faker.js";

export const generateProductsController = (req, res) => {
    res.send({status: 'success', payload: generateProducts()})
} 