import express from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../db/user";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { handleError } from "../utils/handeler";
import bcrypt from "bcrypt";
import crypto from "crypto";
dotenv.config();
export interface token {
  _id: string;
  email: string;
  csrfToken: string;
  exp: number;
}
export async function CheckAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const headerCSRFToken = req.headers["x-csrf-token"];
    const jwtToken = req.cookies["APP_AUTH"];
    const validateErrorPre = "VALIDATE.ERROR.CHECK_AUTH.";
    if (!jwtToken) {
      res.status(401);
      throw Error(`${validateErrorPre}MISSING_AUTHEN_TOKEN`);
    }
    if (!headerCSRFToken) {
      res.status(401);
      throw Error("CSRF token required");
    }
    const decoded = jwt.verify(jwtToken, process.env.SERVER_SECRET as string);
    const user = await UserModel.findOne({ _id: (decoded as token)._id });
    console.log(decoded, "decoded");
    if (!user) {
      res.status(401);
      throw Error("invalid Access TOKEN");
    }
    const now = new Date().getTime();
    const expDate = new Date((decoded as token).exp).getTime() * 1000;
    if (expDate < now) {
      res.status(401);
      throw Error("token expired");
    }
    if ((decoded as token).csrfToken !== headerCSRFToken) {
      res.status(401);
      throw Error("Bad CSRF token");
    }
    if (user.isAdmin != true) {
      res.status(401);
      throw Error("User is not Admin");
    }
    req.user = user;
    next();
  } catch (error) {
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.json(message);
    return;
  }
}
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { name, password } = req.body;
    if (!name) {
      res.status(400).json({ message: "Missing username" });
    }
    if (!password) {
      res.status(400).json({ message: "Missing password" });
    }
    const admin = await UserModel.findOne({ name: name })
      .select("+password")
      .lean();
    if (!admin) {
      res.status(400);
      throw Error("User does not exist");
    }
    const ismatch = await bcrypt.compare(password, admin.password);
    if (!ismatch) {
      res.status(403);
      throw Error("incorrect password");
    }
    const csrf = crypto.randomBytes(128).toString("base64");
    const token = jwt.sign(
      { _id: admin._id, name: admin.name, csrfToken: csrf },
      process.env.ENCRYPTION_KEY as string,
      { algorithm: "HS256", expiresIn: "1d" }
    );
    res.setHeader("X-CSRF-Token", csrf);
    res.setHeader("X-CSRF-Token", csrf);
    res.setHeader("Access-Control-Expose-Headers", "X-CSRF-Token");

    console.log(process.env.NODE_ENV, "node env is");
    if (process.env.NODE_ENV == "production") {
      console.log("is secure");
      res.cookie("APP_AUTH", token, {
        domain: process.env.DOMAIN,
        path: "/",
        expires: new Date(Date.now() + 86400000),
        secure: true,
        sameSite: "none",
      });
    } else
      res.cookie("APP_AUTH", token, {
        domain: process.env.DOMAIN,
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 86400000),
      }); //httpOnly:true,secure:true

    res.status(200).json(admin);
    return;
  } catch (error) {
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.json(message);
    return;
  }
};
export async function me(req: express.Request, res: express.Response) {
  try {
    const headerCSRFToken = req.headers["x-csrf-token"];
    const jwtToken = req.cookies["APP_AUTH"];
    const validateErrorPre = "VALIDATE.ERROR.CHECK_AUTH.";
    if (!jwtToken) {
      res.status(401);
      throw Error(`${validateErrorPre}MISSING_AUTHEN_TOKEN`);
    }
    if (!headerCSRFToken) {
      res.status(401);
      throw Error("CSRF token required");
    }
    const decoded = jwt.verify(jwtToken, process.env.ENCRYPTION_KEY as string);
    const user = await UserModel.findOne({ _id: (decoded as token)._id });
    console.log(decoded, "decoded");
    if (!user) {
      res.status(401);
      throw Error("invalid Access TOKEN");
    }
    const now = new Date().getTime();
    const expDate = new Date((decoded as token).exp).getTime() * 1000;
    if (expDate < now) {
      res.status(401);
      throw Error("token expired");
    }
    if ((decoded as token).csrfToken !== headerCSRFToken) {
      res.status(401);
      throw Error("Bad CSRF token");
    }
    if (user.isAdmin != true) {
      res.status(401);
      throw Error("User is not Admin");
    }
    res.setHeader("X-CSRF-Token", (decoded as token).csrfToken);
    res.status(200).json(user);
    return;
  } catch (error) {
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.json(message);
    return;
  }
}
export const logout = async (req: express.Request, res: express.Response) => {
  try {
    // Clear the cookie by setting it with an expired date
    res.clearCookie("APP_AUTH", {
      domain: process.env.DOMAIN,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" });
  }
};
