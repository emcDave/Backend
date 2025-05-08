import express from "express";
import medicine from "./medicine";
const router = express.Router();
export default (): express.Router => {
  medicine(router);
  return router;
};
