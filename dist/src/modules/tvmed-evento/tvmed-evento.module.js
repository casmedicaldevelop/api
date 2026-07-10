"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TvMedEventoModule = void 0;
const common_1 = require("@nestjs/common");
const tvmed_evento_controller_1 = require("./tvmed-evento.controller");
const tvmed_evento_service_1 = require("./tvmed-evento.service");
let TvMedEventoModule = class TvMedEventoModule {
};
exports.TvMedEventoModule = TvMedEventoModule;
exports.TvMedEventoModule = TvMedEventoModule = __decorate([
    (0, common_1.Module)({
        controllers: [tvmed_evento_controller_1.TvMedEventoController],
        providers: [tvmed_evento_service_1.TvMedEventoService],
    })
], TvMedEventoModule);
//# sourceMappingURL=tvmed-evento.module.js.map