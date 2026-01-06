"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfissionalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const profissional_entity_1 = require("./entities/profissional.entity");
const profissional_service_1 = require("./services/profissional.service");
const profissional_controller_1 = require("./controllers/profissional.controller");
let ProfissionalModule = class ProfissionalModule {
};
exports.ProfissionalModule = ProfissionalModule;
exports.ProfissionalModule = ProfissionalModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([profissional_entity_1.Profissional])],
        providers: [profissional_service_1.ProfissionalService],
        controllers: [profissional_controller_1.ProfissionalController],
        exports: [profissional_service_1.ProfissionalService],
    })
], ProfissionalModule);
