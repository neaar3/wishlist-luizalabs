import { Request, Response } from "express";
import knex from "../database";
import { customerDatabase } from "../shared/customer";
import validateUserData, { validateEmail } from "../helpers/customerValidator";


export async function createUser(req: Request, res: Response) {
    const { name, email } = req.body;

    try {
        await validateUserData({ name, email });

        const checkEmail = await knex<customerDatabase>("customers")
        .where("email", email)
        .first();

        if (checkEmail) {
            return res.status(403).json({ error: "Email already in use." })
        }

        await knex("customers")
        .insert({ name, email });

        return res.status(201).json({message: "User created successfully"})
    } catch (err: any) {
        return res
        .status(500)
        .json({error: err.message});
    }
}

export async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const update = req.body;

    try {

        const user = await knex<customerDatabase>("customers").where("id", parseInt(id)).first();

        
        if(!user) {
            return res.status(403).json({ error: "User does not exist." })
        }

        if(update.email) {
            validateEmail(update.email)

            const checkEmail = await knex.table("customers").where("email", update.email).first();

            if (checkEmail) {
                return res.status(403).json({ error: "Email already in use." })
            }
        }

        await knex.table("customers").where("id", parseInt(id)).update({
            email: update.email ?? user.email,
            name: update.name ?? user.name
        });

        return res.status(201).json({message: "User updated successfully"})
    } catch (err: any) {
        return res
        .status(500)
        .json({error: err.message});
    }
}

export async function deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const checkUser = await knex<customerDatabase>("customers")
        .where("id", id)
        .first();

        if (!checkUser) {
            return res.status(403).json({ error: "User does not exist" })
        }

        await knex("customers")
        .where("id", id)
        .del();

        return res.status(200).json({message: "User deleted successfully"})
    } catch (err: any) {
        return res
        .status(500)
        .json({error: err.message});
    }
}

export async function getUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const userFound = await knex<customerDatabase>("customers")
        .where("id", id)
        .first();

        if(!userFound) {
            res
            .status(404)
            .json({message: "User not found"});
        }

        return res.status(200).json(userFound);
    } catch (err: any) {
        return res
        .status(500)
        .json({error: err.message});
    }
}

export async function getAllUsers(_req: Request, res: Response) {
    try {
        const usersFound = await knex.select().from<customerDatabase>("customers")

        return res.status(200).json(usersFound);
    } catch (err: any) {
        return res
        .status(500)
        .json({error: err.message});
    }
}