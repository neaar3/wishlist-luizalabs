import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { passwordAdmin, secret, usernameAdmin } from "../access";
import Admin from "../shared/admin";

export async function loginAdmin(req: Request, res: Response) {
    const { username, password }: Admin = req.body;

    try{
        const correctUsername = usernameAdmin === username;
        const correctPassword = passwordAdmin === password;

        if (!correctPassword || !correctUsername) {
            res.status(401).json({ message: "Invalid Username or Password. Try again." })
        }

        const token = jwt.sign({ username }, secret, { expiresIn: "2h" });

        return res.status(200).json({ token })
    } catch (err: any) {
        return res.status(400).json({ error: err.message })
    }
}