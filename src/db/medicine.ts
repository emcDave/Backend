import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { MedicineType, FoodRelation } from "./constants";
const Schema = mongoose.Schema;

export const medicineSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: Object.values(MedicineType),
      required: true,
    },
    dosage: {
      morning: { type: Number, default: 0 },
      afternoon: { type: Number, default: 0 },
      evening: { type: Number, default: 0 },
      bedtime: { type: Number, default: 0 },
    },
    foodRelation: {
      type: String,
      enum: Object.values(FoodRelation),
      default: FoodRelation.ANY_TIME,
    },
  },
  { timestamps: true }
);
export const MedModel = mongoose.model("Medicine", medicineSchema);
export const createMed = (values: Record<string, any>) =>
  new MedModel(values).save().then((med) => med.toObject());
export const getAllMeds_ = () => MedModel.find();
export const getByIdMed = (id: string) => MedModel.findOne({ _id: id }).lean();
export const deletedByIdMed = (id: string) =>
  MedModel.findOneAndDelete({ _id: id });
export const editByIdMed = (id: string, values: Record<string, any>) =>
  MedModel.findOneAndUpdate({ _id: id }, values, {
    returnDocument: "after",
  });
