import express from "express";
import { login, me, logout } from "../middleware/auth";
export default (router: express.Router) => {
  router.post("/api/admin/login", login);
  router.get("/api/admin/me", me);
  router.post("/api/admin/logout", logout);
};
