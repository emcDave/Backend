"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMed = exports.deleteMed = exports.getMedById = exports.getAllMeds = exports.addMed = void 0;
const handeler_1 = require("../utils/handeler");
const medicine_1 = require("../db/medicine");
const addMed = async (req, res) => {
    try {
        const { name, type, dosage, foodRelation } = req.body;
        const med = {
            name,
            type,
            dosage,
            foodRelation,
        };
        const newMed = await (0, medicine_1.createMed)(med);
        res.status(200).json(newMed);
        return;
    }
    catch (error) {
        console.log(error);
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.status(500).json(message);
        return;
    }
};
exports.addMed = addMed;
const getAllMeds = async (req, res) => {
    try {
        const meds = await (0, medicine_1.getAllMeds_)();
        res.status(200).json(meds);
        return;
    }
    catch (error) {
        console.log(error);
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.status(500).json(message);
        return;
    }
};
exports.getAllMeds = getAllMeds;
const getMedById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error("Medicine id required");
        const med = await (0, medicine_1.getByIdMed)(id);
        res.status(200).json(med);
        return;
    }
    catch (error) {
        console.log(error);
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.status(500).json(message);
        return;
    }
};
exports.getMedById = getMedById;
const deleteMed = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            throw new Error("Medicine id required");
        const med = await (0, medicine_1.deletedByIdMed)(id);
        res.status(200).json(med);
        return;
    }
    catch (error) {
        console.log(error);
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.status(500).json(message);
        return;
    }
};
exports.deleteMed = deleteMed;
const updateMed = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (!id)
            throw new Error("Medicine id required");
        const med = await (0, medicine_1.editByIdMed)(id, updates);
        res.status(200).json(med);
        return;
    }
    catch (error) {
        console.log(error);
        const message = (0, handeler_1.handleError)(error);
        if (res.statusCode < 400)
            res.status(500);
        res.status(500).json(message);
        return;
    }
};
exports.updateMed = updateMed;
//# sourceMappingURL=medicine.js.map