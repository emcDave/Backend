import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();
export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
const UserSchema = new mongoose.Schema<IUser>(
  {
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
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);

export const setSuperAdmin = async () => {
  const ADMIN_NAME = process.env.ADMIN_NAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const salt_rounds = 10;
  try {
    if (!ADMIN_NAME) throw Error("ADMIN_NAME not set");
    const hash = await bcrypt.genSalt(salt_rounds).then((salt) => {
      if (!ADMIN_PASSWORD) throw Error("ADMIN_PASSWORD not set");
      return bcrypt.hash(ADMIN_PASSWORD, salt);
    });
    await UserModel.findOneAndReplace(
      {},
      {
        name: ADMIN_NAME,
        password: hash,
        isAdmin: true,
      },
      { upsert: true }
    );
    console.log("admin initialised");
  } catch (error) {
    console.log(error);
  }
};
