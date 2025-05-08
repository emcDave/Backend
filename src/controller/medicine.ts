import express from "express";
import { handleError } from "../utils/handeler";
import {
  createMed,
  deletedByIdMed,
  editByIdMed,
  getAllMeds_,
  getByIdMed,
} from "../db/medicine";
import { medicineSchema } from "../db/medicine";

export const addMed = async (req: express.Request, res: express.Response) => {
  try {
    const { name, type, dosage, foodRelation } = req.body;
    const med = {
      name,
      type,
      dosage,
      foodRelation,
    };
    const newMed = await createMed(med);
    res.status(200).json(newMed);
    return;
  } catch (error) {
    console.log(error);
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.status(500).json(message);
    return;
  }
};
export const getAllMeds = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const meds = await getAllMeds_();
    res.status(200).json(meds);
    return;
  } catch (error) {
    console.log(error);
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.status(500).json(message);
    return;
  }
};
export const getMedById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Medicine id required");
    const med = await getByIdMed(id);
    res.status(200).json(med);
    return;
  } catch (error) {
    console.log(error);
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.status(500).json(message);
    return;
  }
};
export const deleteMed = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Medicine id required");
    const med = await deletedByIdMed(id);
    res.status(200).json(med);
    return;
  } catch (error) {
    console.log(error);
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.status(500).json(message);
    return;
  }
};
export const updateMed = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!id) throw new Error("Medicine id required");
    const med = await editByIdMed(id, updates);
    res.status(200).json(med);
    return;
  } catch (error) {
    console.log(error);
    const message = handleError(error);
    if (res.statusCode < 400) res.status(500);
    res.status(500).json(message);
    return;
  }
};
