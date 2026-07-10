"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilingEventModule = void 0;
const common_1 = require("@nestjs/common");
const filing_event_controller_1 = require("./filing-event.controller");
const filing_event_service_1 = require("./filing-event.service");
const drive_module_1 = require("../drive/drive.module");
let FilingEventModule = class FilingEventModule {
};
exports.FilingEventModule = FilingEventModule;
exports.FilingEventModule = FilingEventModule = __decorate([
    (0, common_1.Module)({
        imports: [drive_module_1.DriveModule],
        controllers: [filing_event_controller_1.FilingEventController],
        providers: [filing_event_service_1.FilingEventService],
    })
], FilingEventModule);
//# sourceMappingURL=filing-event.module.js.map