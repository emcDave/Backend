import express from "express";
import {
  addMed,
  getAllMeds,
  getMedById,
  deleteMed,
  updateMed,
} from "../controller/medicine";
export default (router: express.Router) => {
  router.post("/api/med/add", addMed);
  router.get("/api/meds", getAllMeds);
  router.get("/api/med/:id", getMedById);
  router.delete("/api/med/:id", deleteMed);
  router.patch("/api/med/:id", updateMed);
};
