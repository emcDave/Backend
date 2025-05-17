"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
exports.default = (router) => {
    router.post("/api/admin/login", auth_1.login);
    router.get("/api/admin/me", auth_1.me);
    router.post("/api/admin/logout", auth_1.logout);
};
//# sourceMappingURL=user.js.map