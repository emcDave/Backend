"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodRelation = exports.MedicineType = void 0;
var MedicineType;
(function (MedicineType) {
    MedicineType["TABLET"] = "TABLET";
    MedicineType["CAPSULE"] = "CAPSULE";
    MedicineType["LIQUID"] = "LIQUID";
    MedicineType["INJECTION"] = "INJECTION";
    MedicineType["CREAM"] = "CREAM";
    MedicineType["DROPS"] = "DROPS";
    MedicineType["INHALER"] = "INHALER";
    MedicineType["OTHER"] = "OTHER";
})(MedicineType || (exports.MedicineType = MedicineType = {}));
var FoodRelation;
(function (FoodRelation) {
    FoodRelation["BEFORE_FOOD"] = "BEFORE_FOOD";
    FoodRelation["AFTER_FOOD"] = "AFTER_FOOD";
    FoodRelation["WITH_FOOD"] = "WITH_FOOD";
    FoodRelation["ANY_TIME"] = "ANY_TIME";
})(FoodRelation || (exports.FoodRelation = FoodRelation = {}));
//# sourceMappingURL=constants.js.map