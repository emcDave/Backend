import express from "express";
import medicine from "./medicine";
import user from "./user";
const router = express.Router();
export default (): express.Router => {
  medicine(router);
  user(router);
  return router;
};
