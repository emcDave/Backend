"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (error) => {
    let message;
    if (error instanceof Error) {
        message = error.message;
    }
    else
        message = String(error);
    return message;
};
exports.handleError = handleError;
//# sourceMappingURL=handeler.js.map