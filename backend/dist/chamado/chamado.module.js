"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChamadoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chamado_entity_1 = require("./entities/chamado.entity");
const chamado_historico_entity_1 = require("./entities/chamado-historico.entity");
const historico_service_1 = require("./services/historico.service");
const chamado_service_1 = require("./services/chamado.service");
const historico_controller_1 = require("./controllers/historico.controller");
const chamado_controller_1 = require("./controllers/chamado.controller");
let ChamadoModule = class ChamadoModule {
};
exports.ChamadoModule = ChamadoModule;
exports.ChamadoModule = ChamadoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([chamado_entity_1.Chamado, chamado_historico_entity_1.ChamadoHistorico])],
        providers: [historico_service_1.HistoricoService, chamado_service_1.ChamadoService],
        controllers: [historico_controller_1.HistoricoController, chamado_controller_1.ChamadoController],
        exports: [historico_service_1.HistoricoService, chamado_service_1.ChamadoService],
    })
], ChamadoModule);
