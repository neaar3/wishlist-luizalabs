import { Router } from 'express';
import { loginAdmin } from './controllers/admin';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './controllers/costumers';
import { addProductsToFavorites, listProductsFromFavorites, removeProductsFromFavorites } from './controllers/products';
import { authenticated } from './middlewares/auth';

const routes = Router();

routes.post('/login', loginAdmin)

routes.use(authenticated)

routes.post("/costumer", createUser);
routes.put("/costumer/:id", updateUser);
routes.delete("/costumer/:id", deleteUser);
routes.get("/costumer/:id", getUser);
routes.get("/costumer", getAllUsers);

routes.post("/product/:id", addProductsToFavorites);
routes.delete("/product/:id", removeProductsFromFavorites);
routes.get("/product", listProductsFromFavorites);

export default routes;
