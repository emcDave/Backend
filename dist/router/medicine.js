"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medicine_1 = require("../controller/medicine");
exports.default = (router) => {
    router.post("/api/med/add", medicine_1.addMed);
    router.get("/api/meds", medicine_1.getAllMeds);
    router.get("/api/med/:id", medicine_1.getMedById);
    router.delete("/api/med/:id", medicine_1.deleteMed);
    router.patch("/api/med/:id", medicine_1.updateMed);
};
//# sourceMappingURL=medicine.js.map