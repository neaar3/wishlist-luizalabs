import { Router } from 'express';
import { loginAdmin } from './controllers/admin';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './controllers/customers';
import { addProductsToFavorites, listProductsFromFavorites, removeProductsFromFavorites } from './controllers/products';
import { authenticated } from './middlewares/auth';

const routes = Router();

routes.post('/login', loginAdmin)

routes.use(authenticated)

routes.post("/customer", createUser);
routes.put("/customer/:id", updateUser);
routes.delete("/customer/:id", deleteUser);
routes.get("/customer/:id", getUser);
routes.get("/customer", getAllUsers);

routes.post("/product/:id", addProductsToFavorites);
routes.delete("/product/:id", removeProductsFromFavorites);
routes.get("/product", listProductsFromFavorites);

export default routes;
