import Products from "../dao/mongo/products.mongo.js";
import Carts from "../dao/mongo/carts.mongo.js";
import Users from "../dao/mongo/users.mongo.js";
import Messages from "../dao/mongo/messages.mongo.js";
import Tickets from "../dao/mongo/tickets.mongo.js"

import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import UserRepository from "./users.repository.js"
import MessageRepository from "./messages.repository.js"
import TicketRepository from "./tickets.repository.js";

export const productsService = new ProductRepository(new Products())
export const cartsService = new CartRepository(new Carts())
export const usersService = new UserRepository(new Users())
export const messagesService = new MessageRepository(new Messages())
export const ticketsService = new TicketRepository(new Tickets())