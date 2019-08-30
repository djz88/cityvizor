"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
// load express app and export router
var express_1 = __importDefault(require("express"));
var express_dynacl_1 = __importDefault(require("express-dynacl"));
var db_1 = require("../db");
exports.router = express_1.default.Router();
// REQUEST: get event
exports.router.get("/search", express_dynacl_1.default("counterparty", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var counterparties;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.query.query)
                    return [2 /*return*/, res.status(400).send("Missing parameter query")];
                return [4 /*yield*/, db_1.db("payments")
                        .select("counterpartyId", "counterpartyName")
                        .where("counterpartyName", "like", "%" + req.query.query + "%")
                        .orWhere("counterpartyId", req.query.query)];
            case 1:
                counterparties = _a.sent();
                res.json(counterparties);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/top", express_dynacl_1.default("counterparty", "list"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var counterparties;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments")
                    .select("counterpartyId")
                    .max("counterpartyName as counterpartyName")
                    .sum("amount as amount")
                    .groupBy("counterpartyId")
                    .limit(req.query.limit ? Math.min(Number(req.query.limit), 100) : 100)];
            case 1:
                counterparties = _a.sent();
                res.json(counterparties);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:id", express_dynacl_1.default("counterparty", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var counterpartyNames, counterparty;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments")
                    .select("counterpartyName")
                    .where("counterpartyId", req.params.id)
                    .then(function (rows) { return rows.map(function (row) { return row.counterpartyName; }); })];
            case 1:
                counterpartyNames = _a.sent();
                if (!counterpartyNames.length)
                    return [2 /*return*/, res.sendStatus(404)];
                counterparty = {
                    id: req.params.id,
                    name: counterpartyNames[0],
                    names: counterpartyNames
                };
                res.json(counterparty);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:id/accounting", express_dynacl_1.default("counterparty", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var years;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments")
                    .select("year", "type")
                    .sum({ amount: "amount" })
                    .where("counterpartyId", req.params.id)
                    .groupBy("year", "type")];
            case 1:
                years = _a.sent();
                if (years.length)
                    res.json(years);
                else
                    res.sendStatus(404);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:id/accounting/:year", express_dynacl_1.default("counterparty", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var accounting;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments")
                    .select("type", "item", "paragraph", "unit")
                    .sum({ amount: "amount" })
                    .where({ "counterpartyId": req.params.id, "year": req.params.year })
                    .groupBy("type", "item", "paragraph", "unit")];
            case 1:
                accounting = _a.sent();
                if (accounting.length)
                    res.json(accounting);
                else
                    res.sendStatus(404);
                return [2 /*return*/];
        }
    });
}); });
exports.router.get("/:id/payments", express_dynacl_1.default("counterparty", "read"), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var payments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db("payments").where({ counterpartyId: req.params.id, year: req.params.year })];
            case 1:
                payments = _a.sent();
                if (payments.length)
                    res.json(payments);
                else
                    res.sendStatus(404);
                return [2 /*return*/];
        }
    });
}); });