import type { DatasetMeta, TableSpec } from "./types";

export const PERIOD = { from: "01/08/2026", to: "26/08/2026" };
export const SCOPE_LABEL = `Requisições, cotações e pedidos · ${PERIOD.from} a ${PERIOD.to}`;

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export const int = (v: number) => v.toLocaleString("pt-BR");

const CATEGORIES = [
  "Materiais Elétricos",
  "Serviços de Manutenção",
  "TI e Licenças",
  "Insumos Operacionais",
  "EPI e Segurança",
  "Logística",
];

const TITLES = [
  "Reposição de disjuntores tripolares",
  "Manutenção preventiva de compressores",
  "Licenças de software de engenharia",
  "Compra de luvas e óculos de proteção",
  "Serviço de calibração de instrumentos",
  "Cabos de rede categoria 6A",
  "Fretes dedicados para filial norte",
  "Peças de reposição para esteira 03",
  "Notebooks para equipe de campo",
  "Filtros industriais de alta pressão",
];

const STATUSES = [
  ...Array<string>(28).fill("Em Aprovação"),
  ...Array<string>(12).fill("Aprovado"),
  "Cancelado",
];

function seeded(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export const requisitionRows = STATUSES.map((status, i) => {
  const day = 1 + Math.floor(seeded(i + 3) * 26);
  const value = 40 + seeded(i + 11) * 620;
  return {
    numero: `REQ-2026-${(1420 + i).toString().padStart(5, "0")}`,
    criadoEm: `${day.toString().padStart(2, "0")}/08/2026`,
    status,
    titulo: TITLES[i % TITLES.length]!,
    categoria: CATEGORIES[i % CATEGORIES.length]!,
    valor: Number(value.toFixed(2)),
    itens: 1 + Math.floor(seeded(i + 7) * 8),
  };
});

export const REQ_TOTAL_VALUE = 6119.87;

export const quotationRows = [
  {
    numero: "COT-2026-00211",
    criadoEm: "04/08/2026",
    status: "Aguardando Resposta",
    titulo: "Cotação de disjuntores e quadros de comando",
    categoria: "Materiais Elétricos",
    expiraEm: "05/09/2026",
    valor: 48250.0,
  },
  {
    numero: "COT-2026-00212",
    criadoEm: "07/08/2026",
    status: "Finalizado",
    titulo: "Calibração de instrumentos de medição",
    categoria: "Serviços de Manutenção",
    expiraEm: "28/08/2026",
    valor: 1890.4,
  },
  {
    numero: "COT-2026-00213",
    criadoEm: "11/08/2026",
    status: "Aguardando Resposta",
    titulo: "Licenças anuais de software CAD",
    categoria: "TI e Licenças",
    expiraEm: "10/09/2026",
    valor: 1240.0,
  },
  {
    numero: "COT-2026-00214",
    criadoEm: "14/08/2026",
    status: "Em Análise de Negociação",
    titulo: "Fornecimento de EPIs para equipe de campo",
    categoria: "EPI e Segurança",
    expiraEm: "12/09/2026",
    valor: 780.9,
  },
  {
    numero: "COT-2026-00215",
    criadoEm: "19/08/2026",
    status: "Aguardando Resposta",
    titulo: "Fretes dedicados rota norte",
    categoria: "Logística",
    expiraEm: "18/09/2026",
    valor: 620.0,
  },
  {
    numero: "COT-2026-00216",
    criadoEm: "23/08/2026",
    status: "Finalizado",
    titulo: "Filtros industriais de alta pressão",
    categoria: "Insumos Operacionais",
    expiraEm: "22/09/2026",
    valor: 380.5,
  },
];

export const QUOTE_TOTAL_VALUE = quotationRows.reduce((a, r) => a + r.valor, 0);

export const requisitionTable: TableSpec = {
  columns: [
    { key: "numero", label: "Número" },
    { key: "criadoEm", label: "Criado em", type: "date" },
    { key: "status", label: "Status", type: "status" },
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria" },
    { key: "valor", label: "Valor", align: "right", type: "currency" },
    { key: "itens", label: "Itens", align: "right", type: "number" },
  ],
  rows: requisitionRows,
};

export const quotationTable: TableSpec = {
  columns: [
    { key: "numero", label: "Número" },
    { key: "criadoEm", label: "Criado em", type: "date" },
    { key: "status", label: "Status", type: "status" },
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria" },
    { key: "expiraEm", label: "Expira em", type: "date" },
    { key: "valor", label: "Valor", align: "right", type: "currency" },
  ],
  rows: quotationRows,
};

export const orderTable: TableSpec = { columns: quotationTable.columns, rows: [] };

export const datasets: DatasetMeta[] = [
  {
    ref: "ds_requisicoes_v3",
    entity: "requisicoes",
    label: "Requisições",
    records: 41,
    confidence: "confirmed",
    fingerprint: "a71f…9cd2",
    provenance: "Dataset Registry · coleta 26/08/2026 18:02",
    transport: "inline-batch",
  },
  {
    ref: "ds_cotacoes_v3",
    entity: "cotacoes",
    label: "Cotações",
    records: 6,
    confidence: "confirmed",
    fingerprint: "c04b…12ae",
    provenance: "Dataset Registry · coleta 26/08/2026 18:02",
    transport: "inline-batch",
  },
  {
    ref: "ds_pedidos_v3",
    entity: "pedidos",
    label: "Pedidos",
    records: null,
    confidence: "unconfirmed",
    fingerprint: "—",
    provenance: "Coleta incompleta nesta atualização",
    transport: "deferred",
  },
];

export const dailySeries = Array.from({ length: 26 }, (_, i) => {
  const d = i + 1;
  const reqs = Math.round(1 + seeded(i + 2) * 3.4);
  const value = Math.round(60 + seeded(i + 5) * 420);
  return { label: `${d.toString().padStart(2, "0")}/08`, value: reqs, secondary: value };
});

export const supplierRanking = [
  { label: "Volt Elétrica Ltda", value: 48250 },
  { label: "TecnoCAD Sistemas", value: 1240 },
  { label: "Calibra Metrologia", value: 1890 },
  { label: "SafeWork EPI", value: 781 },
  { label: "RotaNorte Logística", value: 620 },
  { label: "FiltroMax Industrial", value: 381 },
].sort((a, b) => b.value - a.value);

export const categoryRanking = [
  { label: "Materiais Elétricos", value: 2180.4 },
  { label: "Serviços de Manutenção", value: 1420.9 },
  { label: "TI e Licenças", value: 1105.2 },
  { label: "Insumos Operacionais", value: 780.6 },
  { label: "EPI e Segurança", value: 412.3 },
  { label: "Logística", value: 220.47 },
];
