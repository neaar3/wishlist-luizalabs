import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { passwordAdmin, secret, usernameAdmin } from "../access";
import Admin from "../shared/admin";

export async function loginAdmin(req: Request, res: Response) {
    const login: Admin = req.body;

    if(!login.username || !login.password) {
        return res.status(400).json({ message: "Login must contain username and password" })
    }

    try{
        const correctUsername = usernameAdmin === login.username;
        const correctPassword = passwordAdmin === login.password;

        if (!correctPassword || !correctUsername) {
            return res.status(401).json({ message: "Invalid Username or Password. Try again." })
        }

        const token = jwt.sign({ username: login.username }, secret, { expiresIn: "2h" });

        return res.status(200).json({ token })
    } catch (err: any) {
        return res.status(400).json({ error: err.message })
    }
}