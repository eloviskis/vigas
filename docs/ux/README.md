# VITAS UX/UI Documentation

Documentação completa de experiência do usuário, wireframes, fluxos e design system do VITAS.

## 📚 Documentos

### 1. [Wireframes](wireframes.md)
Representações visuais (ASCII art) de todas as telas principais.

**Conteúdo**:
- Layout base (header + content + navbar)
- Fluxo de autenticação (login, registro, recuperação de senha)
- Dashboard do cliente
- Criar chamado (categoria, descrição, fotos, localização)
- Triagem em progresso
- Profissionais sugeridos
- Detalhes do profissional
- Orçamento recebido
- Agendamento (seleção de data/hora)
- Pagamento (PIX e Cartão)
- QR Code PIX
- Confirmação de pagamento
- Avaliação pós-serviço
- Dashboard do profissional
- Lista de chamados disponíveis
- Envio de orçamento

**Design System**:
- Paleta de cores (primária, secundária, sucesso, atenção, perigo)
- Typography (headings, body, captions)
- Componentes (botões, inputs, cards)
- Responsividade (mobile, tablet, desktop)
- Acessibilidade (WCAG AA)

### 2. [User Flows](user-flows.md)
Documentação detalhada de cada fluxo de interação.

**Fluxos cobertos**:
1. **Autenticação**
   - Login
   - Registro
   - Esqueceu senha

2. **Cliente - Criar Chamado**
   - Fluxo principal (happy path)
   - Fluxo alternativo: múltiplos profissionais
   - Fluxo alternativo: cancelar chamado

3. **Triagem e Matching**
   - Algoritmo de scoring (0-100)
   - Matching de profissionais
   - Notificações de triagem

4. **Agendamento**
   - Seleção de data/hora
   - Confirmação de agendamento
   - Mudança de horário (reagendamento)

5. **Pagamento**
   - Fluxo PIX (QR Code)
   - Fluxo Cartão de Crédito
   - Pagamento recusado
   - Pagamento expirado

6. **Execução do Serviço**
   - Check-in do profissional
   - Confirmação de conclusão
   - Confirmação do cliente

7. **Avaliação**
   - Fluxo principal (avaliação pós-serviço)
   - Follow-ups automatizados (D+7, D+30, D+90)

8. **Profissional - Receber Chamado**
   - Notificação de novo chamado
   - Envio de orçamento
   - Cliente pede ajuste
   - Recusar chamado

9. **Saque (Profissional)**
   - Quando recebe o pagamento
   - Tela de extrato

10. **Suporte e Disputas**
    - Cliente reclama do serviço
    - Profissional não apareceu

**Estatísticas**:
- Taxa de conversão esperada
- Tempo médio em cada etapa

## 🎯 Estrutura de Informação

### Navegação Principal
```
└─ Home (Dashboard)
   ├─ Novo Chamado
   ├─ Meus Chamados
   ├─ Histórico
   └─ Perfil

└─ Chamados (Profissional)
   ├─ Disponíveis
   ├─ Meus Orçamentos
   ├─ Agendados
   └─ Histórico

└─ Conta
   ├─ Perfil
   ├─ Notificações
   ├─ Segurança
   ├─ Pagamentos
   └─ Suporte
```

### Fluxos de Navegação
```
Login → Dashboard (Cliente/Profissional)
      → [Novo Chamado] → Criar → Triagem → Profissionais → Detalhes → Orçamento
      → [Meus Chamados] → Detalhes → Chat → Agendamento → Pagamento → Avaliação
      → [Perfil] → Editar Dados → Segurança → Sair

Profissional:
      → [Chamados] → Disponíveis → Enviar Orçamento
      → [Agendados] → Detalhes → Check-in → Concluir → Receber Avaliação
      → [Extrato] → Histórico de Saques
```

## 💫 Interações Principais

### Gestos
- **Swipe**: Navegar entre abas
- **Long press**: Ações contextuais (compartilhar, excluir)
- **Pull to refresh**: Recarregar lista
- **Double tap**: Salvar/marcar favorito

### Micro-interações
- Loading spinners (ao fazer requisição)
- Toast notifications (feedback de ações)
- Confirmation dialogs (ações destrutivas)
- Success animations (pagamento concluído, etc.)
- Error messages (com ícone de erro)

### States dos Componentes
```
Botões:
- Default (normal)
- Hover (desktop)
- Pressed (mobile)
- Disabled (cinza, sem cursor)
- Loading (spinner)

Inputs:
- Default (vazio)
- Focused (borda azul, cursor)
- Filled (com valor)
- Error (borda vermelha, mensagem)
- Disabled (cinza, sem edição)

Cards:
- Default (sombra leve)
- Hover (sombra maior)
- Pressed (pressionar down)
- Disabled (cinza, opaco)
```

## 🎨 Design Tokens

### Espaçamento
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Tamanhos de Fonte
```
h1: 28px / 700 bold
h2: 24px / 600 semi-bold
h3: 20px / 600 semi-bold
body: 16px / 400 regular
label: 14px / 500 medium
caption: 12px / 400 regular
```

### Elevação (Sombras)
```
elevation-1: box-shadow: 0 1px 3px rgba(0,0,0,0.12)
elevation-2: box-shadow: 0 4px 6px rgba(0,0,0,0.16)
elevation-3: box-shadow: 0 8px 16px rgba(0,0,0,0.20)
```

### Raios de Borda
```
xs: 2px
sm: 4px
md: 8px
lg: 12px
full: 9999px (pills)
```

## 📱 Breakpoints de Responsividade

### Ranges
```
Mobile: 320px - 479px (xs, sm)
        480px - 599px (md)
Tablet: 600px - 839px (md)
        840px - 1023px (lg)
Desktop: 1024px+ (xl, xxl)
```

### Mudanças em cada breakpoint
```
Mobile:
- Bottom sheet para menus
- Drawer menu (hamburger)
- Botões full-width
- Layout single-column
- Touch targets 48px min

Tablet:
- Sidebar navigation
- 2-column layout possível
- Dropdowns em vez de bottom sheets
- Mais espaçamento

Desktop:
- 3+ column layout
- Floating windows possível
- Multiselect avançado
- Drag-and-drop
```

## ♿ Acessibilidade

### Contrastes (WCAG AA)
```
Texto normal: 4.5:1 (mínimo)
Texto grande: 3:1 (mínimo)
Componentes UI: 3:1 (mínimo)
```

### Teclado
- Tab order lógico
- Visible focus indicators
- Escape para fechar dialogs
- Enter para submeter formas
- Setas para navegar menus

### Screen Reader
- ARIA labels em botões
- Alt text em imagens
- Roles semânticos
- Live regions para notificações
- Form labels linkedadas

### Cores
- Não usar cor como única forma de comunicar
- Ícones + cor + texto
- Alto contraste modo para usuários com visão reduzida

## 🌙 Dark Mode

Versão escura está planejada para fase 2:
- Background principal: #121212
- Surfaces: #1E1E1E
- Primária: #4A9FFF (mais brilhante)
- Texto: #FFFFFF

## 🌍 Internacionalização (i18n)

Fases:
1. **Fase 1 (MVP)**: Português (Brasil)
2. **Fase 2**: Inglês, Espanhol
3. **Fase 3**: Japonês, Mandarim

## 📲 Offline-First Strategy

### O app funciona sem internet?
```
✓ Visualizar chamados criados
✓ Ler histórico de conversas
✓ Ver agendamentos
✗ Criar novo chamado
✗ Enviar mensagem
✗ Visualizar profissionais em tempo real

Sincronização automática quando voltar online
```

## 🚀 Performance

### Targets
```
First Contentful Paint: < 1.5s
Largest Contentful Paint: < 2.5s
Cumulative Layout Shift: < 0.1
```

### Otimizações
- Code splitting por rota
- Lazy loading de imagens
- Service worker para cache
- Compressão de assets
- Minificação de código

## 🔔 Notificações

### Push Notifications
```
Tipos:
- Novo chamado disponível (profissional)
- Orçamento recebido (cliente)
- Cliente aceitou orçamento (profissional)
- Serviço confirmado (profissional)
- Serviço concluído (cliente)
- Avaliação recebida (profissional)
- Pagamento processado (ambos)

Tempo ideal de envio:
- 8h-21h (horário comercial)
- Max 3 notificações/dia por usuário
- Respeitar "Não perturbe"
```

## 📊 Métricas de UX

### Rastreamento
```
- Eventos de clique (botões, links)
- Tempo em cada tela
- Taxa de abandono de fluxos
- Searches realizadas
- Filtros mais usados
- Taxa de conversão de chamados
```

### Metas
```
- 80%+ de usuários completam perfil no register
- 60%+ de clientes usam câmera para fotos
- 30%+ de clientes voltam em 30 dias
- 90%+ de profissionais respondem em 1h
- 85%+ de avaliações >= 4 estrelas
```

---

## 🔗 Relacionamentos

Este projeto de UX está conectado a:
- [Backend Architecture](../architecture/README.md)
- [API Documentation](../api/README.md)
- [GitHub Issues](https://github.com/eloviskis/vitas/issues)

---

**Última atualização**: 6 de janeiro de 2026  
**Versão**: 1.0.0  
**Status**: MVP em design (100% de wireframes definidos)
