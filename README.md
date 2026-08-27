# Procurement Genius

Build a COMPLETE high-fidelity working product prototype in ONE generation.

Do not create only a landing page, wireframe, design concept, or empty shell.

Do not wait for another prompt to implement the important screens.

I need a polished, functional AI-generated Business Intelligence experience that will serve as the visual/product reference for a real enterprise application.

============================================================

PRODUCT CONTEXT

============================================================

Product name:

ME Genius

It is an enterprise conversational AI platform for procurement.

The user talks naturally to an AI assistant called Genius.

Example:

"Gere um painel das minhas requisições, cotações e pedidos de

01/08/2026 a 26/08/2026 com indicadores, gráficos e tabelas."

Meaning:

"Generate a dashboard of my purchase requisitions, quotations and purchase

orders from 01/08/2026 to 26/08/2026 with indicators, charts and tables."

The user should NOT need to type commands such as:

/dashboard

/panel

/bi

Natural language should be the experience.

============================================================

WHAT HAPPENS IN THE REAL SYSTEM

============================================================

Our real backend architecture is approximately:

USER

→ Genius Chat

→ dashboard intent detection

→ BI Studio

→ DataPlan

→ Dataset Registry

→ complete validated datasets

→ AI Dashboard Composer

→ DashboardBlueprint JSON

→ Semantic Validator

→ Layout Engine

→ native React renderer

→ dashboard shown in a side workspace called "Lousa".

For this prototype:

DO NOT recreate the backend.

Create realistic frontend adapters/interfaces that simulate these stages.

The UI must be easy to connect later to real APIs.

Use mock data only.

NEVER include credentials, tokens, secrets or real company data.

============================================================

CORE ARCHITECTURAL PRINCIPLE

============================================================

The AI decides:

WHAT the dashboard should communicate.

The product decides:

HOW a beautiful dashboard is rendered.

Do NOT design the product around the AI generating raw HTML/CSS layouts.

Think of the AI as producing a semantic dashboard specification such as:

DashboardBlueprint

- title

- subtitle

- executive summary

- sections

- widgets

- insights

- recommendations

- follow-up questions

and the frontend renderer guarantees excellent design.

The visual quality must therefore be deterministic and consistent.

============================================================

WHY WE ARE BUILDING THIS

============================================================

Our current experimental BI Studio is technically functional but visually weak.

Current problems include:

- dashboards that look like raw HTML;

- huge cards with very little content;

- charts that occupy only a small corner of oversized cards;

- excessive white space;

- weak information hierarchy;

- technically correct but unattractive data tables;

- AI-generated composition that varies too much;

- widgets without a strong visual grammar;

- the dashboard does not feel as polished as a modern AI product;

- interactions such as save/edit/resize exist conceptually but do not yet feel

  like a cohesive product.

We want to completely solve this PRODUCT EXPERIENCE.

Do not make small cosmetic improvements.

Create the experience we SHOULD have built.

============================================================

DESIGN DIRECTION

============================================================

The desired quality level is:

modern SaaS analytics

+

executive BI dashboard

+

AI-native workspace

+

the polish of Lovable-style generated applications.

The experience should feel:

clean

premium

analytical

dense but breathable

enterprise-ready

fast

interactive

intelligent

NOT:

generic admin template

old Power BI clone

raw HTML

developer console

debug dashboard

overly colorful

glassmorphism-heavy

huge empty cards

mobile app stretched to desktop

============================================================

VISUAL LANGUAGE

============================================================

Use a modern design system approach compatible with:

React

TypeScript

Tailwind

shadcn-style primitives

Recharts-style charts

Use:

- neutral surfaces;

- subtle borders;

- restrained shadows;

- strong typography hierarchy;

- excellent spacing;

- accessible contrast;

- consistent radius;

- semantic status colors;

- one coherent chart palette;

- excellent hover/focus states;

- Lucide-style line icons.

Avoid:

- emojis as UI icons;

- random gradients everywhere;

- 3D charts;

- excessive shadows;

- rainbow charts;

- giant empty cards;

- tiny charts;

- excessive rounded pills;

- decorative UI with no analytical purpose.

============================================================

MAIN APP LAYOUT

============================================================

The application has a persistent top bar and navigation rail.

The primary experience is:

LEFT:

conversation with Genius

RIGHT:

BI workspace / "Lousa"

Desktop should support:

1. split mode:

   chat roughly 35-40%

   dashboard roughly 60-65%

2. expanded dashboard mode:

   dashboard occupies almost the full working area

3. closed dashboard:

   only chat remains

A dashboard result card inside the chat allows the user to reopen the same

dashboard.

============================================================

CHAT EXPERIENCE

============================================================

Create a realistic Genius conversation.

User message:

"Gere um painel das minhas requisições, cotações e pedidos de

01/08/2026 a 26/08/2026 com indicadores, gráficos e tabelas."

During generation, show a compact expandable activity area:

Genius

Agente de BI Studio

✓ Requisições

✓ Cotações

✓ Pedidos

✓ Estruturando análise

✓ Painel criado

This is PRODUCT PROGRESS.

Do NOT display hidden chain-of-thought or private reasoning.

The technical activity is secondary and collapsible.

============================================================

PROGRESSIVE GENERATION

============================================================

The experience should feel similar to a modern AI builder.

Immediately after generation starts:

open the Lousa.

Show an elegant dashboard skeleton.

Then progressively reveal:

first:

core KPIs / first useful content

then:

charts

then:

insights/recommendations

Do not blank or replace the entire page.

Enrich the dashboard in place.

The previous good state should remain visible while later content arrives.

============================================================

FINAL CHAT RESPONSE

============================================================

After completion, Genius sends a concise message such as:

"Montei o painel com o panorama das suas requisições, cotações e pedidos.

Você pode explorar os indicadores, análises e dados na Lousa."

Then display a compact result card:

┌────────────────────────────────────┐

│ [chart icon] Dashboard atualizado  │

│              10 widgets            │

│                         Ver painel ›│

└────────────────────────────────────┘

IMPORTANT:

The widget count must feel dynamic, not hardcoded.

The card remains in the conversation.

Clicking:

"Ver painel"

reopens the SAME dashboard.

Closing the Lousa must NOT delete the dashboard.

============================================================

DASHBOARD HEADER

============================================================

The dashboard header is extremely important.

Design something elegant similar to:

Dashboard da conversa                       ✎  ☆  [↻ Atualizar dados]  ⛶  ×

Adicionar subtítulo...

Use:

large strong title

subtle subtitle

clear right-aligned actions.

Actions:

Edit title/subtitle

Save to Panels / favorite

Refresh data

Expand / collapse workspace

Close

"Atualizar dados" should be a real visible button with icon + text.

Edit / favorite / expand / close can be icon-only with tooltips.

============================================================

TITLE EDITING

============================================================

Clicking edit or title:

inline edit.

Enter/blur:

save.

Escape:

cancel.

Subtitle placeholder:

"Adicionar subtítulo..."

============================================================

SAVE / FAVORITE

============================================================

The star has real product semantics.

Empty star:

"Salvar nos painéis"

Saving:

loading state.

Filled star:

saved.

Click filled star:

remove from saved panels.

For this prototype:

persist locally so reload demonstrates that saved dashboards survive.

Create a "Painéis" view where saved dashboards appear as beautiful cards.

============================================================

PRIMARY TABS

============================================================

Only two main tabs:

[Painel] [Dados]

Use a segmented/pill control.

Do NOT create an empty "Insights" tab.

Insights live inside the dashboard narrative.

============================================================

THE DASHBOARD MUST TELL A STORY

============================================================

The dashboard should NOT simply be a random grid of charts.

Use sections such as:

VISÃO GERAL

FLUXO E STATUS

VALORES E CONCENTRAÇÃO

TENDÊNCIA

ONDE OLHAR PRIMEIRO

RECOMENDAÇÕES

DETALHAMENTO

These are a DEFAULT narrative structure.

The AI specification may omit a section when there is no evidence.

============================================================

EXECUTIVE SUMMARY

============================================================

Immediately under the tabs, show a concise executive summary.

Example:

"Entre 01/08 e 26/08, o fluxo ficou concentrado em requisições em aprovação

e cotações aguardando resposta. Não há pedidos confirmados no recorte."

Maximum 2-3 lines.

Make it readable, not a giant card.

============================================================

KPI STRIP

============================================================

Use a compact KPI strip.

Example fictional values:

Requisições

41

Cotações

6

Pedidos

—

Valor requisitado

R$ 6.119,87

Rules:

- 4 KPIs → one row on desktop;

- 3 KPIs → still compact, never three giant full-width rows;

- one KPI must never occupy the entire dashboard width;

- same visual height;

- strong numerical hierarchy;

- subtle supporting label/trend/status.

============================================================

IMPORTANT DATA STATE

============================================================

Our system distinguishes:

CONFIRMED ZERO

from:

DATA NOT CONFIRMED.

Represent both differently.

Example:

Pedidos

0

"Nenhum pedido no período"

versus:

Pedidos

—

"Dados não confirmados nesta atualização"

Never silently display zero for an unverified empty result.

Include this state in the prototype.

============================================================

FLOW & STATUS

============================================================

Create a section:

FLUXO E STATUS

Examples:

- requisitions by status;

- quotations by status;

- process volume.

Use the chart that makes the business question easiest to understand.

Prefer:

horizontal bars for status distributions;

bars for rankings;

line/area for time;

donut only for simple part-to-whole.

Charts must fill their cards properly.

No tiny chart inside huge white container.

============================================================

VALUES & CONCENTRATION

============================================================

Create:

VALORES E CONCENTRAÇÃO

Examples:

Top suppliers by value

Top categories

Value concentration

Quotation value distribution

Use fictional data.

Cards should be analytically meaningful.

============================================================

TREND

============================================================

Create:

TENDÊNCIA

Use line or area chart.

Example:

Documents created by day

Value over time

Use subtle axes/grid and useful tooltip.

============================================================

WHERE TO LOOK FIRST

============================================================

Create an editorial section:

ONDE OLHAR PRIMEIRO

It should NOT look like charts.

Use ranked insight cards/rows.

Example:

1.

28 de 41 requisições estão em aprovação.

"A aprovação concentra 68% do fluxo."

2.

Uma cotação concentra 91% do valor cotado.

"Revisar se o valor representa evento excepcional."

3.

3 cotações aguardam resposta.

"Existe risco de atraso no processo."

Each insight includes:

short title

quantified evidence

one-sentence interpretation

subtle severity/tone

============================================================

RECOMMENDATIONS

============================================================

Create:

RECOMENDAÇÕES

Examples:

"Priorizar as requisições mais antigas em aprovação."

"Revisar a cotação com concentração anormal de valor."

"Acionar fornecedores das cotações sem resposta."

Recommendations must look actionable.

============================================================

DETAIL

============================================================

Optionally place a compact detail/ranking widget at the bottom of the dashboard.

Avoid turning the dashboard into a giant spreadsheet.

The full exploration belongs in the Dados tab.

============================================================

NEW SECTION

============================================================

At the bottom:

+ Nova seção

Clicking creates a new empty section.

Section title is editable.

This is deterministic UI behavior.

Do not invoke AI just to create an empty section.

============================================================

WIDGET INTERACTIONS

============================================================

Widgets are interactive.

Normal state:

clean.

Hover state:

reveal subtle controls.

Include:

drag handle

rename

AI edit

delete

lock/unlock

Resize handle appears subtly.

Do not permanently clutter every widget with buttons.

============================================================

DRAG & RESIZE

============================================================

Widgets can be:

dragged

reordered

resized.

Use a 12-column responsive grid.

Interactions should feel smooth.

Persist the custom layout locally.

Resize charts responsively.

No internal scrollbar unless the content truly requires it.

============================================================

LOCK

============================================================

Locked widget:

cannot drag

cannot resize.

Show a small lock indicator.

============================================================

RENAME

============================================================

Rename is deterministic.

Use a polished inline/popover editor.

Do not call AI for simple rename.

============================================================

DELETE

============================================================

Delete removes only the target widget.

Optionally show a short undo toast.

Do not regenerate the dashboard.

============================================================

AI EDIT PER WIDGET

============================================================

This interaction is critical.

Hover widget → click sparkle/AI icon.

Open a polished popover or side sheet:

"Como você quer alterar este widget?"

Text input.

Example instructions:

"Troque para barras horizontais."

"Mostre percentual."

"Destaque os cancelados."

"Transforme em ranking."

Show an "Aplicando alteração..." state on the target widget while preserving

the previous version.

For the prototype:

simulate an AI patch and change the widget representation.

Do NOT regenerate the full dashboard.

============================================================

DATA TAB

============================================================

The Dados tab must feel like a business product, NOT a database inspector.

Top area:

Dados do painel

entity selector:

[ Requisições 41 ]

[ Cotações 6 ]

[ Pedidos — ]

Only ONE entity table visible at a time.

============================================================

REQUISITIONS DATA EXAMPLE

============================================================

Header:

Detalhe das requisições

41 registros no período

Toolbar:

Search

Columns

Filters

Density

Use a polished data grid.

Suggested columns:

Número

Criado em

Status

Título

Categoria

Valor

Itens

Use:

status pills

pt-BR dates

Brazilian currency

numbers right aligned

sticky key column if helpful

controlled title wrapping

tooltips for truncation

pagination

Example statuses:

Em Aprovação

Aprovado

Cancelado

============================================================

QUOTATIONS DATA EXAMPLE

============================================================

Use 6 fictional records.

Suggested columns:

Número

Criado em

Status

Título

Categoria

Expira em

Valor

Statuses:

Aguardando Resposta

Finalizado

Em Análise de Negociação

============================================================

TECHNICAL FIELDS

============================================================

Do NOT show internal fields as primary columns:

dataset_ref

_entidade

fingerprint

provenance

internal IDs

transport strategy

If useful, put them under:

"Detalhes técnicos"

inside a collapsed disclosure.

============================================================

CONTINUE THE ANALYSIS

============================================================

At the end of Dados:

CONTINUAR A ANÁLISE

Create context-aware suggestions such as:

→ Detalhar requisições ainda em aprovação?

→ Comparar fornecedores por concentração de valor?

→ Revisar cotações aguardando resposta?

→ Analisar evolução por categoria?

Clicking one should place/send the suggestion back into the CHAT experience.

This interaction is important.

============================================================

SAVED PANELS

============================================================

Create a "Painéis" screen.

Show saved dashboards as polished cards.

Each card can show:

title

subtitle / scope

last updated time

widget count

favorite state

Actions:

open

rename

duplicate

remove

share placeholder

Opening a saved dashboard returns to the same visual experience.

============================================================

ERROR / EMPTY / LOADING STATES

============================================================

Design excellent states for:

1. Loading:

skeleton representation of the actual dashboard layout.

2. Confirmed empty:

"Sem resultados no recorte."

3. Unverified empty:

"Não foi possível confirmar os dados nesta atualização."

4. Temporary error:

show last-known-good dashboard when possible

+

small retry action.

Do not replace the entire workspace with a red technical error.

============================================================

RESPONSIVENESS

============================================================

Primary target:

desktop enterprise application.

Support:

1440px wide

1920px wide

split chat workspace

expanded dashboard.

At smaller widths:

stack intelligently.

Do NOT optimize primarily for phone.

============================================================

BLUEPRINT MODEL FOR THE PROTOTYPE

============================================================

Create a TypeScript semantic model conceptually like:

DashboardBlueprint

SectionBlueprint

WidgetBlueprint

UserLayoutOverride

The blueprint must describe:

semantics

NOT raw presentation pixels.

Example widget properties:

id

type

title

intent

datasetRef

dimension

measure

aggregation

format

size

priority

Do NOT put CSS or arbitrary class strings into the blueprint.

============================================================

LAYOUT ENGINE

============================================================

Implement a deterministic layout layer.

The layout engine, NOT the blueprint, decides actual grid spans.

Example grammar:

metric → 3 columns

table → 12 columns

ranking → 6 columns

status distribution → 4 or 6 columns

trend → 6 or 12 columns

insights → editorial rows/cards

Do not let a metric become a full-width 500px card.

============================================================

COMPONENT ARCHITECTURE

============================================================

Create reusable product-level components.

Examples:

DashboardShell

DashboardHeader

DashboardTabs

DashboardSection

MetricCard

MetricStrip

ChartCard

StatusDistribution

RankingChart

TrendChart

InsightRow

RecommendationCard

DataExplorer

EntitySelector

DashboardResultCard

AgentProgress

WidgetChrome

WidgetAiEdit

SavedPanelCard

Feel free to improve the names.

Keep the visual system centralized.

============================================================

MOCK DATA

============================================================

Use realistic FICTIONAL procurement data.

Suggested starting scope:

01/08/2026 — 26/08/2026

Requisitions:

41

Quotation requests:

6

Purchase orders:

0 confirmed

Status example:

Requisitions:

28 Em Aprovação

12 Aprovado

1 Cancelado

Quotations:

3 Aguardando Resposta

2 Finalizado

1 Em Análise de Negociação

Use fictional values/suppliers/categories.

DO NOT use real employee names or private company records.

============================================================

IMPORTANT: THE 0 ORDERS CASE

============================================================

Because purchase orders are zero in the example,

do NOT fabricate:

top order suppliers

order value trends

order categories.

The dashboard should adapt gracefully.

No data → no fake chart.

Use the space for relevant requisition/quotation analysis.

============================================================

PRODUCT QUALITY BAR

============================================================

The final result must make someone say:

"This looks like a real, premium BI product."

Not:

"This looks like AI-generated HTML."

Before finishing, inspect the page yourself and correct:

oversized cards

tiny charts

poor whitespace

weak hierarchy

overflow

cut labels

bad wrapping

inconsistent spacing

redundant cards

boring repeated visualizations.

============================================================

MOST IMPORTANT OUTPUT

============================================================

I want a WORKING application, not documentation.

Implement in this single generation:

- chat;

- generation progress;

- result card;

- split Lousa;

- expanded Lousa;

- dashboard header;

- Painel;

- Dados;

- KPIs;

- multiple chart types;

- insights;

- recommendations;

- data grid;

- continue analysis;

- widget hover;

- drag;

- resize;

- lock;

- rename;

- delete;

- simulated AI widget edit;

- new section;

- refresh interaction;

- save/favorite;

- saved panels screen;

- loading;

- error;

- confirmed empty;

- unverified empty.

Use mocked services where real APIs would be connected later.

============================================================

FINAL RULE

============================================================

Do not optimize for amount of code.

Optimize for:

PRODUCT QUALITY

VISUAL QUALITY

COHESIVE EXPERIENCE

REUSABILITY

The AI should decide what the dashboard means.

The frontend should guarantee how a beautiful dashboard looks.

Build the full high-fidelity prototype now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4f808b8f-dcae-4bc2-a58a-413cac393fe4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
