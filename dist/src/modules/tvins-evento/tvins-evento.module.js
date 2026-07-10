"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvInsEventoModule = void 0;
const common_1 = require("@nestjs/common");
const tvins_evento_controller_1 = require("./tvins-evento.controller");
const tvins_evento_service_1 = require("./tvins-evento.service");
let TvInsEventoModule = class TvInsEventoModule {
};
exports.TvInsEventoModule = TvInsEventoModule;
exports.TvInsEventoModule = TvInsEventoModule = __decorate([
    (0, common_1.Module)({
        controllers: [tvins_evento_controller_1.TvInsEventoController],
        providers: [tvins_evento_service_1.TvInsEventoService],
    })
], TvInsEventoModule);
//# sourceMappingURL=tvins-evento.module.js.map