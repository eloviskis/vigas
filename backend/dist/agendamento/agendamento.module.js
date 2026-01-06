"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const slot_entity_1 = require("./entities/slot.entity");
const agendamento_entity_1 = require("./entities/agendamento.entity");
const slot_service_1 = require("./services/slot.service");
const agendamento_service_1 = require("./services/agendamento.service");
const slot_controller_1 = require("./controllers/slot.controller");
const agendamento_controller_1 = require("./controllers/agendamento.controller");
const chamado_module_1 = require("../chamado/chamado.module");
const chamado_entity_1 = require("../chamado/entities/chamado.entity");
let AgendamentoModule = class AgendamentoModule {
};
exports.AgendamentoModule = AgendamentoModule;
exports.AgendamentoModule = AgendamentoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([slot_entity_1.Slot, agendamento_entity_1.Agendamento, chamado_entity_1.Chamado]), chamado_module_1.ChamadoModule],
        providers: [slot_service_1.SlotService, agendamento_service_1.AgendamentoService],
        controllers: [slot_controller_1.SlotController, agendamento_controller_1.AgendamentoController],
        exports: [slot_service_1.SlotService, agendamento_service_1.AgendamentoService],
    })
], AgendamentoModule);
