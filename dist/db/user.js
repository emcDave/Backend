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
exports.setSuperAdmin = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "must be a valid email address",
        ],
    },
    password: {
        type: String,
        minLength: 8,
        required: true,
        select: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("User", UserSchema);
const setSuperAdmin = async () => {
    const ADMIN_NAME = process.env.ADMIN_NAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const salt_rounds = 10;
    try {
        if (!ADMIN_NAME)
            throw Error("ADMIN_NAME not set");
        const hash = await bcrypt_1.default.genSalt(salt_rounds).then((salt) => {
            if (!ADMIN_PASSWORD)
                throw Error("ADMIN_PASSWORD not set");
            return bcrypt_1.default.hash(ADMIN_PASSWORD, salt);
        });
        await exports.UserModel.findOneAndReplace({}, {
            name: ADMIN_NAME,
            password: hash,
            isAdmin: true,
        }, { upsert: true });
        console.log("admin initialised");
    }
    catch (error) {
        console.log(error);
    }
};
exports.setSuperAdmin = setSuperAdmin;
//# sourceMappingURL=user.js.map