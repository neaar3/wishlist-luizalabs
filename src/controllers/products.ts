import { Request, Response } from "express";
import axios from "axios";
import knex from "../database";
import { ProductsDatabase } from "../shared/products";

export async function addProductsToFavorites(req: Request, res: Response) {
    const { id } = req.params;
    const { costumerId } = req.body;

    try {
        const products = await axios.get(`http://challenge-api.luizalabs.com/api/product/${id}/`)
        .then(res => res.data)
        .catch(err => console.log(err));

        if (!products) {
            return res.status(400).json({ message: "Product does not exist" });
        }

        const productAlreadyAdded = await knex.select().from<Partial<ProductsDatabase>>("products").where("costumer_id", costumerId);

        if(productAlreadyAdded) {
            return res.status(403).json({ message: "Can't duplicate product in favorite's list" });
        }

        await knex("products")
        .insert({ ...products, costumer_id: costumerId });

        return res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

export async function removeProductsFromFavorites(req: Request, res: Response) {
    const { id } = req.params;
    const { costumerId } = req.body;

    try {
        const productAlreadyAdded = await knex.first().from<Partial<ProductsDatabase>>("products").where({ costumer_id: costumerId, id });

        if(!productAlreadyAdded) {
            return res.status(400).json({ message: "Product isn't in favorite list." });
        }

        await knex("products")
        .where("id", id)
        .del();

        return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

export async function listProductsFromFavorites(req: Request, res: Response) {
    const { costumerId } = req.body;

    try {
        const products = await knex.select("*").from<Partial<ProductsDatabase>>("products").where("costumer_id", costumerId);

        return res.status(200).json(products);
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}