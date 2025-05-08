"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editByIdMed = exports.deletedByIdMed = exports.getByIdMed = exports.getAllMeds_ = exports.createMed = exports.MedModel = exports.medicineSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("./constants");
const Schema = mongoose_1.default.Schema;
exports.medicineSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: Object.values(constants_1.MedicineType),
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
        enum: Object.values(constants_1.FoodRelation),
        default: constants_1.FoodRelation.ANY_TIME,
    },
}, { timestamps: true });
exports.MedModel = mongoose_1.default.model("Medicine", exports.medicineSchema);
const createMed = (values) => new exports.MedModel(values).save().then((med) => med.toObject());
exports.createMed = createMed;
const getAllMeds_ = () => exports.MedModel.find();
exports.getAllMeds_ = getAllMeds_;
const getByIdMed = (id) => exports.MedModel.findOne({ _id: id }).lean();
exports.getByIdMed = getByIdMed;
const deletedByIdMed = (id) => exports.MedModel.findOneAndDelete({ _id: id });
exports.deletedByIdMed = deletedByIdMed;
const editByIdMed = (id, values) => exports.MedModel.findOneAndUpdate({ _id: id }, values, {
    returnDocument: "after",
});
exports.editByIdMed = editByIdMed;
//# sourceMappingURL=medicine.js.map