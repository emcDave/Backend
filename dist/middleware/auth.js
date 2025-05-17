"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
exports.CheckAdmin = CheckAdmin;
exports.me = me;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../db/user");
const dotenv = __importStar(require("dotenv"));
const handeler_1 = require("../utils/handeler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
dotenv.config();
async function CheckAdmin(req, res, next) {
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
        const decoded = jsonwebtoken_1.default.verify(jwtToken, process.env.SERVER_SECRET);
        const user = await user_1.UserModel.findOne({ _id: decoded._id });
        console.log(decoded, "decoded");
        if (!user) {
            res.status(401);
            throw Error("invalid Access TOKEN");
        }
        const now = new Date().getTime();
        const expDate = new Date(decoded.exp).getTime() * 1000;
        if (expDate < now) {
            res.status(401);
            throw Error("token expired");
        }
        if (decoded.csrfToken !== headerCSRFToken) {
            res.status(401);
            throw Error("Bad CSRF token");
        }
        if (user.isAdmin != true) {
            res.status(401);
            throw Error("User is not Admin");
        }
        req.user = user;
        next();
    }
    catch (error) {
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.json(message);
        return;
    }
}
const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name) {
            res.status(400).json({ message: "Missing username" });
        }
        if (!password) {
            res.status(400).json({ message: "Missing password" });
        }
        const admin = await user_1.UserModel.findOne({ name: name })
            .select("+password")
            .lean();
        if (!admin) {
            res.status(400);
            throw Error("User does not exist");
        }
        const ismatch = await bcrypt_1.default.compare(password, admin.password);
        if (!ismatch) {
            res.status(403);
            throw Error("incorrect password");
        }
        const csrf = crypto_1.default.randomBytes(128).toString("base64");
        const token = jsonwebtoken_1.default.sign({ _id: admin._id, name: admin.name, csrfToken: csrf }, process.env.ENCRYPTION_KEY, { algorithm: "HS256", expiresIn: "1d" });
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
        }
        else
            res.cookie("APP_AUTH", token, {
                domain: process.env.DOMAIN,
                path: "/",
                httpOnly: true,
                expires: new Date(Date.now() + 86400000),
            }); //httpOnly:true,secure:true
        res.status(200).json(admin);
        return;
    }
    catch (error) {
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.json(message);
        return;
    }
};
exports.login = login;
async function me(req, res) {
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
        const decoded = jsonwebtoken_1.default.verify(jwtToken, process.env.ENCRYPTION_KEY);
        const user = await user_1.UserModel.findOne({ _id: decoded._id });
        console.log(decoded, "decoded");
        if (!user) {
            res.status(401);
            throw Error("invalid Access TOKEN");
        }
        const now = new Date().getTime();
        const expDate = new Date(decoded.exp).getTime() * 1000;
        if (expDate < now) {
            res.status(401);
            throw Error("token expired");
        }
        if (decoded.csrfToken !== headerCSRFToken) {
            res.status(401);
            throw Error("Bad CSRF token");
        }
        if (user.isAdmin != true) {
            res.status(401);
            throw Error("User is not Admin");
        }
        res.setHeader("X-CSRF-Token", decoded.csrfToken);
        res.status(200).json(user);
        return;
    }
    catch (error) {
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.json(message);
        return;
    }
}
const logout = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.js.map