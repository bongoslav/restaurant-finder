import { Request, Response } from "express";
import bcrypt from "bcrypt"
import User from "../models/user.model";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll()
    return res.json({
      users: users
    })
  } catch (err) {
    return res.status(400).json({ err })
  }
}

export const login = async (req: Request, res: Response) => {
  const email: string = req.body.email
  const password: string = req.body.password

  // TODO: validation

  try {
    const user = await User.findOne({ where: { email } })

    const match = bcrypt.compare(password, user.password)
    if (match) {
      jwt.sign({
        email: user.email,
        username: user.username,
      }, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) {
          // todo proper error
          res.json({ loggedIn: false, status: "Try again later" })
          return;
        }
        res.json({ loggedIn: true, token })
      })
    } else {
      return res.status(401).json({ message: "Wrong username or password." })
    }
  } catch (err) {
    return res.status(404).json({ message: "User not found." })
  }
}

export const register = async (req: Request, res: Response) => {
  const email: string = req.body.email
  const username: string = req.body.username
  const name: string = req.body.name
  const password: string = req.body.password
  // TODO: validation

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    await User.create({ email, username, name, password: hash });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err); // Log the specific error for debugging purposes
    return res.status(500).json({ message: "Something went wrong while registering." });
  }
}
