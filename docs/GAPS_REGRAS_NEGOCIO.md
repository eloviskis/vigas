# 🎯 Análise de Gaps: Regras de Negócio e Proposta de Valor

**Data**: 05/01/2026  
**Status**: 🔴 CRÍTICO - Faltam definições essenciais  

---

## 🚨 GAPS CRÍTICOS (BLOQUEADORES DE NEGÓCIO)

### 1. **💰 MODELO DE MONETIZAÇÃO - NÃO DEFINIDO**

**Problema**: O sistema não tem NENHUM mecanismo de pagamento ou geração de receita.

**Perguntas sem resposta:**
- Como a VITAS ganha dinheiro?
- Quanto o cliente paga?
- Como o profissional recebe?
- Qual a taxa da plataforma?

**Opções a decidir:**

#### Opção A: Comissão sobre Serviço
```
Cliente paga: R$ 100
  ├─ Profissional recebe: R$ 85 (85%)
  └─ VITAS fica com: R$ 15 (15%)
```

#### Opção B: Assinatura Profissional
```
Profissional paga: R$ 49,90/mês
Cliente não paga nada
VITAS lucra: Assinaturas × profissionais
```

#### Opção C: Modelo Híbrido
```
Assinatura básica: R$ 29,90/mês (até 10 chamados)
Comissão por serviço: 10% sobre cada atendimento
```

**DECISÃO NECESSÁRIA**: Definir modelo AGORA antes de qualquer MVP.

---

### 2. **💳 SISTEMA DE PAGAMENTOS - AUSENTE**

**O que falta:**

```typescript
// NÃO EXISTE NADA DISSO:
interface Pagamento {
  id: string;
  chamadoId: string;
  valor: number;
  status: 'PENDENTE' | 'APROVADO' | 'CANCELADO';
  metodoPagamento: 'PIX' | 'CARTAO' | 'BOLETO';
  pixChave?: string;
  transacaoId?: string;
}
```

**Implementação necessária:**
- [ ] Integração com gateway (Stripe, Mercado Pago, Pagarme)
- [ ] Fluxo: Orçamento → Aprovação Cliente → Pagamento → Repasse Profissional
- [ ] Split payment (divisão automática)
- [ ] Escrow (segurar pagamento até conclusão)
- [ ] Política de reembolso

**Sem isso**: Profissionais não recebem, VITAS não lucra.

---

### 3. **✅ VERIFICAÇÃO DE PROFISSIONAIS - INEXISTENTE**

**Problema**: Qualquer pessoa pode se cadastrar como profissional.

**Riscos:**
- ❌ Profissionais sem qualificação
- ❌ Golpistas/fraudadores
- ❌ Sem responsabilização
- ❌ Reputação da plataforma destruída

**Implementação necessária:**

```typescript
interface VerificacaoProfissional {
  documentoIdentidade: string; // CPF/CNPJ
  comprovanteEndereco: File;
  certificadosProfissionais?: File[];
  referenciasAnteriores?: string[];
  statusVerificacao: 'PENDENTE' | 'APROVADO' | 'REJEITADO';
  verificadoPor?: string; // ID do admin
  dataVerificacao?: Date;
}
```

**Processo sugerido:**
1. Profissional envia documentos
2. Admin analisa (48h)
3. Background check (opcional - Serasa, antecedentes)
4. Aprovação → pode receber chamados
5. Selo "Verificado" no perfil

**Sem isso**: Qualidade zero, risco legal enorme.

---

### 4. **⭐ SISTEMA DE AVALIAÇÕES - INCOMPLETO**

**O que existe:**
```typescript
// Profissional tem score, mas...
score: number; // Como é calculado?
totalServiços: number; // Onde é incrementado?
```

**O que falta:**

```typescript
interface Avaliacao {
  id: string;
  chamadoId: string;
  clienteId: string;
  profissionalId: string;
  nota: 1 | 2 | 3 | 4 | 5; // Estrelas
  comentario?: string;
  pontualidade: number; // 1-5
  qualidade: number; // 1-5
  comunicacao: number; // 1-5
  recomenda: boolean;
  dataAvaliacao: Date;
}
```

**Fluxo necessário:**
1. Serviço concluído → Cliente recebe email
2. Cliente avalia (obrigatório para novos chamados?)
3. Score profissional atualiza automaticamente
4. Avaliações aparecem no perfil público
5. Profissional pode responder

**Gamificação:**
- 🏆 100 avaliações 5★ → Badge "Expert"
- 🎯 95% de aprovação → Destaque em buscas
- 📈 Pontuação > 4.8 → Preço premium

**Sem isso**: Sem qualidade mensurável, sem confiança.

---

### 5. **📋 ORÇAMENTOS E APROVAÇÃO - AUSENTE**

**Problema**: Cliente não sabe quanto vai pagar ANTES de contratar.

**Fluxo atual (QUEBRADO):**
```
Cliente cria chamado
  ↓
Sistema recomenda profissional
  ↓
??? (O QUE ACONTECE AQUI?)
  ↓
Agendamento (sem valor definido)
```

**Fluxo correto:**

```typescript
interface Orcamento {
  id: string;
  chamadoId: string;
  profissionalId: string;
  valorServico: number;
  deslocamento: number;
  materiais?: number;
  total: number;
  descricaoDetalhada: string;
  prazoExecucao: string; // "2-3 horas"
  validadeOrcamento: Date; // 7 dias
  status: 'ENVIADO' | 'APROVADO' | 'RECUSADO' | 'EXPIRADO';
}
```

**Novo fluxo:**
1. Cliente cria chamado
2. Sistema recomenda 3 profissionais
3. **Profissionais enviam orçamentos (24h)**
4. **Cliente compara e escolhe**
5. **Cliente aprova orçamento**
6. Pagamento/agendamento
7. Execução

**Sem isso**: Sem transparência, conflitos garantidos.

---

### 6. **🛡️ GARANTIA E POLÍTICA DE CANCELAMENTO - INDEFINIDA**

**Cenários sem regras:**

❓ **Cliente cancela 1h antes do agendamento** - E agora?
- Profissional já estava a caminho
- Quem paga o deslocamento?
- Taxa de cancelamento?

❓ **Serviço mal feito** - Como resolver?
- Cliente reclama que vazamento não foi resolvido
- Profissional diz que fez certo
- Quem arbitra?
- Garantia de retrabalho?

❓ **Profissional não aparece** - Consequências?
- Cliente esperando
- Bloqueio automático?
- Penalidade?

**Políticas necessárias:**

```typescript
interface PoliticaCancelamento {
  // Cancelamento pelo cliente
  ate24h: { taxaReembolso: 100 }, // Reembolso total
  ate12h: { taxaReembolso: 50 },  // 50% de taxa
  ate1h: { taxaReembolso: 0 },    // Sem reembolso
  
  // Cancelamento pelo profissional
  semJustificativa: { 
    penalidade: 'BLOQUEIO_7_DIAS',
    multaPontuacao: -10
  },
  comJustificativa: {
    requires: 'APROVACAO_ADMIN'
  }
}

interface Garantia {
  prazo: 30, // dias
  cobertura: 'RETRABALHO_GRATIS',
  condicoes: [
    'Mesmo problema reportado',
    'Sem uso indevido pelo cliente',
    'Dentro do prazo'
  ]
}
```

**Sem isso**: Disputas infinitas, sem regras claras.

---

### 7. **📊 DASHBOARD DO PROFISSIONAL - AUSENTE**

**Profissional precisa ver:**
- 💰 Ganhos do mês/semana
- 📅 Próximos agendamentos
- ⭐ Avaliações recebidas
- 📈 Estatísticas (taxa aceitação, tempo médio)
- 💳 Histórico de pagamentos
- 🎯 Metas e badges

**Não existe NADA disso hoje.**

---

### 8. **🔔 NOTIFICAÇÕES - BÁSICAS DEMAIS**

**O que falta:**

```typescript
interface Notificacao {
  tipo: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
  evento: 
    | 'NOVO_CHAMADO'           // Profissional
    | 'ORCAMENTO_RECEBIDO'     // Cliente
    | 'AGENDAMENTO_PROXIMO'    // Ambos (1h antes)
    | 'SERVICO_CONCLUIDO'      // Cliente (avaliar)
    | 'PAGAMENTO_APROVADO'     // Profissional
    | 'AVALIACAO_RECEBIDA';    // Profissional
}
```

**Implementar:**
- [ ] Email transacional (SendGrid, Resend)
- [ ] SMS (Twilio) - opcional
- [ ] Push notifications (Firebase)
- [ ] WhatsApp Business API - futuro

**Sem isso**: Usuários esquecem, engajamento baixo.

---

### 9. **📜 TERMOS E COMPLIANCE - AUSENTE**

**Legal obrigatório:**
- [ ] Termos de Uso
- [ ] Política de Privacidade (LGPD)
- [ ] Contrato Profissional
- [ ] Política de Cookies
- [ ] Declaração de Responsabilidade

**Riscos sem isso:**
- ❌ Multas LGPD (até 2% faturamento)
- ❌ Sem proteção legal em disputas
- ❌ Dados pessoais sem consentimento explícito

---

### 10. **🎫 SISTEMA DE CUPONS/PROMOÇÕES - AUSENTE**

**Marketing zero:**
- Sem cupom de primeira compra
- Sem indicação premiada (referral)
- Sem desconto fidelidade
- Sem campanhas sazonais

**Implementar:**

```typescript
interface Cupom {
  codigo: string; // "BEMVINDO10"
  tipo: 'PERCENTUAL' | 'VALOR_FIXO';
  desconto: number;
  minimoCompra?: number;
  validadeInicio: Date;
  validadeFim: Date;
  usosPorUsuario: number;
  usosTotal: number;
}
```

**Sem isso**: CAC (custo aquisição) alto, crescimento lento.

---

## 📊 MATRIZ DE PRIORIDADE

| Gap | Impacto | Urgência | Complexidade | Prioridade |
|-----|---------|----------|--------------|------------|
| 💰 Modelo Monetização | 🔥🔥🔥 | 🔥🔥🔥 | 🧠 Baixa (decisão) | **P0** |
| 💳 Pagamentos | 🔥🔥🔥 | 🔥🔥 | 🧠🧠🧠 Alta | **P1** |
| ✅ Verificação Profissionais | 🔥🔥🔥 | 🔥🔥 | 🧠🧠 Média | **P1** |
| 📋 Orçamentos | 🔥🔥🔥 | 🔥🔥 | 🧠🧠 Média | **P1** |
| ⭐ Avaliações | 🔥🔥 | 🔥 | 🧠🧠 Média | **P2** |
| 🛡️ Garantias/Cancelamento | 🔥🔥 | 🔥 | 🧠 Baixa | **P2** |
| 📊 Dashboard Profissional | 🔥 | 🔥 | 🧠🧠 Média | **P2** |
| 🔔 Notificações | 🔥🔥 | 🔥 | 🧠🧠 Média | **P2** |
| 📜 Termos/Compliance | 🔥🔥 | 🔥🔥 | 🧠 Baixa | **P1** |
| 🎫 Cupons | 🔥 | 🔵 | 🧠 Baixa | **P3** |

---

## 🎯 PROPOSTA DE VALOR - O QUE OFERECER?

### Para o Cliente:
✅ **Já temos:**
- Encontrar profissional rápido
- Triagem automática
- Profissionais avaliados

❌ **Falta oferecer:**
- **Preço transparente** (orçamentos)
- **Garantia de qualidade** (retrabalho grátis)
- **Segurança** (pagamento protegido)
- **Conveniência** (agendamento online)
- **Comparação** (3 orçamentos)

### Para o Profissional:
✅ **Já temos:**
- Receber chamados
- Gerenciar agenda
- Construir reputação

❌ **Falta oferecer:**
- **Pagamento garantido** (escrow)
- **Dashboard financeiro** (ganhos)
- **Marketing automático** (perfil público)
- **Crescimento profissional** (badges, certificações)
- **Ferramentas de gestão** (histórico, notas fiscais)

### Para a VITAS:
✅ **Já temos:**
- Plataforma funcional
- Matching automático

❌ **Falta oferecer:**
- **Receita** (monetização)
- **Escalabilidade** (sem processo manual)
- **Qualidade** (verificação)
- **Confiança** (avaliações reais)

---

## 🚀 ROADMAP RECOMENDADO

### FASE 0: Decisões de Negócio (1 semana)
```
[ ] Definir modelo de monetização
[ ] Definir políticas de cancelamento
[ ] Definir garantias oferecidas
[ ] Escrever termos de uso
[ ] Escolher gateway de pagamento
```

### FASE 1: MVP Funcional (3 semanas)
```
[ ] Sistema de orçamentos
[ ] Integração pagamento
[ ] Verificação básica profissionais
[ ] Avaliações pós-serviço
[ ] Notificações email
[ ] Termos de uso (aceite obrigatório)
```

### FASE 2: Profissionalização (4 semanas)
```
[ ] Dashboard profissional completo
[ ] Sistema de garantias
[ ] Políticas cancelamento automatizadas
[ ] Push notifications
[ ] Cupons/promoções
[ ] Análise de dados
```

### FASE 3: Crescimento (ongoing)
```
[ ] WhatsApp integration
[ ] App nativo
[ ] Programa de fidelidade
[ ] Marketplace de produtos
[ ] Franquia/licenciamento
```

---

## ⚠️ DECISÕES URGENTES

**HOJE:**
1. ✅ Definir modelo de monetização
2. ✅ Escolher gateway de pagamento
3. ✅ Escrever política de cancelamento

**ESTA SEMANA:**
1. ✅ Implementar orçamentos
2. ✅ Implementar verificação profissionais
3. ✅ Implementar avaliações

**PRÓXIMAS 2 SEMANAS:**
1. ✅ Integrar pagamentos
2. ✅ Dashboard profissional
3. ✅ Notificações automáticas

---

## 💡 RECOMENDAÇÕES FINAIS

### Modelo de Negócio Sugerido:

```
COMISSÃO HÍBRIDA:
├─ Cliente paga serviço
├─ Escrow segura valor
├─ Serviço concluído → Cliente aprova
├─ VITAS retém 12% (competitivo)
└─ Profissional recebe 88%

ASSINATURA PREMIUM (opcional):
├─ R$ 39,90/mês
├─ Comissão reduzida para 8%
├─ Destaque em buscas
├─ Selo "Premium"
└─ Analytics avançado
```

### Garantia Proposta:
```
✅ 30 dias de garantia
✅ Retrabalho grátis (mesmo problema)
✅ Mediação VITAS em disputas
✅ Reembolso parcial se não resolvido
```

### Verificação Mínima:
```
✅ CPF/CNPJ validado
✅ Comprovante endereço
✅ Telefone verificado (SMS)
✅ Email verificado
🔜 Certificações (futuro)
🔜 Background check (futuro)
```

---

**CONCLUSÃO**: O sistema ESTÁ FUNCIONANDO tecnicamente, mas **NÃO É UM NEGÓCIO ainda**. Sem modelo de pagamento, verificação e garantias, é apenas um "formulário bonito".

**AÇÃO IMEDIATA**: Agendar reunião para decidir monetização HOJE. Tudo mais depende dessa decisão.
