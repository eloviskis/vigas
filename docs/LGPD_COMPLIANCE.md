# Conformidade LGPD - VITAS

## 📋 Visão Geral

Implementação completa da **Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)** na plataforma VITAS.

## 🔒 Direitos dos Titulares (Art. 18)

### I - Confirmação da Existência de Tratamento
**Status:** ✅ Implementado

Os usuários podem confirmar se processamos seus dados através da Política de Privacidade.

### II - Acesso aos Dados
**Status:** ✅ Implementado

**Endpoint:** `GET /api/lgpd/my-data`

**Frontend:** Botão "Exportar Meus Dados" em [Política de Privacidade](frontend/src/pages/legal/PoliticaPrivacidade.tsx)

**Exemplo de resposta:**
```json
{
  "usuario": {
    "id": "user-123",
    "email": "usuario@example.com",
    "nome": "João Silva",
    "role": "cliente"
  },
  "chamados": [...],
  "pagamentos": [...],
  "avaliacoes": [...],
  "dataExportacao": "2026-01-11T15:30:00.000Z"
}
```

### III - Correção de Dados
**Status:** ✅ Implementado

**Endpoint:** `PATCH /api/auth/profile`

**Frontend:** Página de [Perfil](frontend/src/pages/Perfil.tsx) com formulário de edição

### VI - Eliminação dos Dados
**Status:** ✅ Implementado

**Endpoint:** `DELETE /api/lgpd/delete-account`

**Frontend:** Botão "Solicitar Exclusão de Conta" em Política de Privacidade

**Fluxo:**
1. Usuário solicita exclusão
2. Conta marcada como inativa
3. Período de retenção: 30 dias
4. Após 30 dias: Anonimização automática (via cron job)

### VII - Portabilidade
**Status:** ✅ Implementado

Exportação em formato JSON estruturado incluindo todos os dados do usuário.

### VIII - Informação sobre Compartilhamento
**Status:** ✅ Implementado

Documentado na Política de Privacidade:
- Profissionais recebem: nome, telefone, endereço (para serviço)
- Clientes veem: nome, telefone, avaliações do profissional
- Gateways de pagamento: dados para transação
- Não vendemos dados a terceiros

## 🛡️ Base Legal do Tratamento

### Execução de Contrato (Art. 7º, V)
- Conexão cliente-profissional
- Processamento de pagamentos
- Notificações sobre serviços

### Legítimo Interesse (Art. 7º, IX)
- Verificação de identidade de profissionais
- Prevenção de fraudes
- Melhoria de serviços

### Consentimento (Art. 7º, I)
- Marketing (opt-in)
- Comunicações promocionais

## 📝 Políticas e Termos

### Política de Privacidade
**Localização:** `frontend/src/pages/legal/PoliticaPrivacidade.tsx`

**Conteúdo:**
- Dados coletados
- Finalidades
- Compartilhamento
- Direitos do titular
- Segurança
- Retenção
- Contato do DPO

### Termos de Uso
**Localização:** `frontend/src/pages/legal/TermosDeUso.tsx`

**Conteúdo:**
- Uso aceitável
- Responsabilidades
- Limitações de responsabilidade

## 🔐 Medidas de Segurança (Art. 46)

### Criptografia
- ✅ SSL/TLS em todas comunicações (HTTPS)
- ✅ Senhas com bcrypt (hash + salt)
- ✅ Tokens JWT com expiração

### Controle de Acesso
- ✅ Autenticação obrigatória
- ✅ Guards por role (cliente, profissional, admin)
- ✅ Rate limiting (10 req/min)

### Backup e Recuperação
- ✅ Backup diário do banco de dados
- ✅ Retenção de 7 dias

### Logs e Auditoria
- ✅ Logs estruturados (pino-http)
- ✅ Registro de acessos
- ✅ Retenção: 6 meses

## 📊 Ciclo de Vida dos Dados

### Coleta
- Cadastro de clientes e profissionais
- Criação de chamados
- Processamento de pagamentos
- Avaliações

### Uso
- Matching cliente-profissional
- Comunicações
- Análise de métricas (agregadas, anonimizadas)

### Retenção

| Tipo de Dado | Período | Justificativa |
|--------------|---------|---------------|
| Dados cadastrais | Até exclusão da conta | Execução de contrato |
| Histórico de serviços | 5 anos | Obrigação fiscal |
| Logs de acesso | 6 meses | Segurança |
| Dados de pagamento | 5 anos | Código Civil Art. 206 |

### Exclusão/Anonimização
- **Solicitação:** Via botão na Política de Privacidade
- **Prazo:** 30 dias (período de reflexão)
- **Método:** Anonimização (não exclusão física)
- **Dados anonimizados:**
  - Email → `deleted_{userId}@anonymized.com`
  - Nome → "Usuário Excluído"
  - Endereço → "ENDEREÇO ANONIMIZADO"
  - Descrição chamados → "Descrição removida por solicitação do usuário"

## 🌍 Localização GPS

### Conformidade
- ✅ Solicitação apenas quando necessário (busca de profissionais)
- ✅ Uso temporário (não armazenado)
- ✅ Permite recusa (graceful degradation)
- ✅ Profissionais NÃO veem localização exata do cliente

### Implementação
```typescript
// Frontend solicita permissão
navigator.geolocation.getCurrentPosition(
  (position) => {
    // Usa lat/lng apenas para busca
    // NÃO envia para backend
  },
  (error) => {
    // Continua sem filtro de distância
  }
);
```

## 👤 Encarregado de Dados (DPO)

**Nome:** [A definir]  
**Email:** lgpd@vitas.com.br  
**Telefone:** (11) 9999-9999

**Responsabilidades:**
- Aceitar reclamações
- Orientar colaboradores
- Interagir com ANPD
- Monitorar conformidade

## 🚨 Incidentes de Segurança

### Plano de Resposta

1. **Detecção:** Logs + alertas
2. **Contenção:** Isolamento do sistema afetado
3. **Avaliação:** Gravidade do vazamento
4. **Notificação ANPD:** Até 2 dias úteis (se alto risco)
5. **Notificação titulares:** Imediatamente (se alto risco)
6. **Correção:** Patch de segurança
7. **Documentação:** Relatório de incidente

## 📧 Comunicação com Titulares

### Consentimento de Marketing
**Status:** ⚠️ A implementar

Adicionar checkbox opt-in no cadastro para:
- Newsletter
- Promoções
- Novos serviços

### Template de Email

**Confirmação de Cadastro:**
```
Olá {nome},

Sua conta VITAS foi criada com sucesso!

Ao se cadastrar, você concorda com nossos:
- Termos de Uso: https://vitas.app.br/termos-de-uso
- Política de Privacidade: https://vitas.app.br/politica-privacidade

Seus direitos LGPD:
- Exportar dados: Acesse Perfil > Exportar Dados
- Corrigir dados: Acesse Perfil > Editar
- Excluir conta: Política de Privacidade > Solicitar Exclusão

Dúvidas? lgpd@vitas.com.br
```

## 🔄 Transferência Internacional

**Status:** ❌ Não aplicável

Todos os dados são armazenados em servidores no Brasil.

## 📋 Registro de Atividades de Tratamento (Art. 37)

### Template

| Campo | Descrição |
|-------|-----------|
| Finalidade | Conexão cliente-profissional |
| Base legal | Execução de contrato |
| Categorias de dados | Nome, email, telefone, endereço |
| Categorias de titulares | Clientes, profissionais |
| Compartilhamento | Profissionais (nome, telefone cliente) |
| Medidas de segurança | Criptografia, controle de acesso |
| Retenção | Até exclusão da conta |

## ✅ Checklist LGPD

### Requisitos Técnicos
- [x] Criptografia SSL/TLS
- [x] Hash de senhas (bcrypt)
- [x] Controle de acesso (JWT + Guards)
- [x] Rate limiting
- [x] Logs estruturados
- [x] Backup automático

### Requisitos Documentais
- [x] Política de Privacidade
- [x] Termos de Uso
- [x] Contato DPO
- [ ] Registro de atividades de tratamento
- [ ] Plano de resposta a incidentes (documentado)

### Requisitos Funcionais
- [x] Exportação de dados (JSON)
- [x] Solicitação de exclusão
- [x] Edição de dados pessoais
- [ ] Revogação de consentimento marketing
- [ ] Dashboard de preferências de privacidade

### Requisitos Organizacionais
- [ ] Treinamento de equipe em LGPD
- [ ] Contratos com processadores (ex: gateway pagamento)
- [ ] Avaliação de impacto (RIPD)
- [ ] Auditoria anual

## 🎯 Próximos Passos

1. **Implementar revogação de consentimento**
   - Checkbox marketing no cadastro
   - Página de preferências

2. **Criar dashboard de privacidade**
   - Ver quem acessou meus dados
   - Histórico de exportações
   - Log de compartilhamento

3. **Automatizar anonimização**
   - Cron job para processar exclusões após 30 dias
   - Script: `backend/scripts/anonymize-users.ts`

4. **Treinar equipe**
   - Workshop LGPD
   - Manual de boas práticas

5. **Contratos DPA (Data Processing Agreement)**
   - Mercado Pago
   - AWS/S3
   - Firebase/FCM

## 📚 Referências

- [LGPD - Lei 13.709/2018](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [Guia ANPD](https://www.gov.br/anpd/pt-br)
- [Resolução CD/ANPD nº 2/2022](https://www.in.gov.br/web/dou/-/resolucao-cd/anpd-n-2-de-27-de-janeiro-de-2022-376562019) (Agentes de Tratamento)
