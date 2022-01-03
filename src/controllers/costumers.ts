import { Request, Response } from "express";
import knex from "../database";
import { CostumerDatabase } from "../shared/costumer";
import validateUserData, { emailValidator, validateEmail } from "../utils/costumerValidator";


export async function createUser(req: Request, res: Response) {
    const { name, email } = req.body;

    try {
        await validateUserData({ name, email });

        const checkEmail = await knex<CostumerDatabase>("costumers")
        .first("*")
        .where("email", email);

        if (checkEmail) {
            return res.status(403).json({ error: "Email already in use." })
        }

        await knex("costumers")
        .insert({ name, email });

        return res.status(201).json({message: "User created successfully"})
    } catch (err: any) {
        res
        .status(500)
        .json({error: err.message});
    }
}

export async function updateUser(req: Request, res: Response) {
    const { userId } = req.params;
    const update = req.body;

    try {
        const user = await knex<CostumerDatabase>("costumers").where("id", userId).first();

        if(!user) {
            return res.status(403).json({ error: "User does not exist." })
        }

        if(update.email) {
            validateEmail(update.email)

            const checkEmail = await knex<CostumerDatabase>("costumers")
            .where("email", update.email)
            .first();

            if (checkEmail) {
                return res.status(403).json({ error: "Email already in use." })
            }
        }

        await knex("costumers")
        .where("id", userId)
        .update({
            email: update.email ?? user.email,
            name: update.name ?? user.name
        });

        return res.status(201).json({message: "User updated successfully"})
    } catch (err: any) {
        res
        .status(500)
        .json({error: err.message});
    }
}

export async function deleteUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const checkUser = await knex<CostumerDatabase>("costumers")
        .where("id", userId)
        .first();

        if (!checkUser) {
            return res.status(404).json({ error: "User does not exist" })
        }

        await knex("costumers")
        .where("id", userId)
        .del();

        return res.status(200).json({message: "User deleted successfully"})
    } catch (err: any) {
        res
        .status(500)
        .json({error: err.message});
    }
}

export async function getUser(req: Request, res: Response) {
    const { userId } = req.params;

    try {
        const userFound = await knex<CostumerDatabase>("costumers")
        .where("id", userId)
        .first();

        if(!userFound) {
            res
            .status(404)
            .json({message: "User not found"});
        }

        return res.status(200).json(userFound);
    } catch (err: any) {
        res
        .status(500)
        .json({error: err.message});
    }
}

export async function getAllUsers(_req: Request, res: Response) {
    try {
        const usersFound = await knex.select().from<CostumerDatabase>("costumers")

        return res.status(200).json(usersFound);
    } catch (err: any) {
        res
        .status(500)
        .json({error: err.message});
    }
}