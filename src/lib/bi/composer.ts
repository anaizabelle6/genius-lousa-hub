import type { DashboardBlueprint, SectionBlueprint, WidgetBlueprint, WidgetSize } from "./types";
import {
  QUOTE_TOTAL_VALUE,
  REQ_TOTAL_VALUE,
  SCOPE_LABEL,
  categoryRanking,
  dailySeries,
  datasets,
  quotationRows,
  requisitionTable,
  supplierRanking,
} from "./mockData";

/**
 * Simulated AI Dashboard Composer.
 * In production this comes from BI Studio → DataPlan → Composer → Semantic Validator.
 */
export function composeBlueprint(id = "dash_conversa_1"): DashboardBlueprint {
  const overview: SectionBlueprint = {
    id: "sec_overview",
    title: "Visão geral",
    kind: "overview",
    widgets: [
      metric("w_req", "Requisições", "Volume total de requisições no recorte", 41, "integer", {
        deltaLabel: "no período",
        hint: "41 documentos criados",
      }),
      metric("w_cot", "Cotações", "Volume total de cotações enviadas", 6, "integer", {
        hint: "6 processos de cotação",
      }),
      {
        ...metric("w_ped", "Pedidos", "Pedidos de compra confirmados", null, "integer"),
        emptyState: { kind: "unconfirmed", message: "Dados não confirmados nesta atualização" },
      },
      metric("w_val", "Valor requisitado", "Valor somado das requisições", REQ_TOTAL_VALUE, "currency", {
        hint: "Soma das 41 requisições",
      }),
    ],
  };

  const flow: SectionBlueprint = {
    id: "sec_flow",
    title: "Fluxo e status",
    description: "Onde os documentos estão parados hoje.",
    kind: "flow",
    widgets: [
      {
        id: "w_req_status",
        type: "status-distribution",
        title: "Requisições por status",
        intent: "Identificar concentração de requisições em aprovação",
        datasetRef: "ds_requisicoes_v3",
        dimension: "status",
        measure: "documentos",
        aggregation: "count",
        format: "integer",
        size: "md",
        priority: 10,
        series: [
          { label: "Em Aprovação", value: 28, tone: "attention" },
          { label: "Aprovado", value: 12, tone: "positive" },
          { label: "Cancelado", value: 1, tone: "critical" },
        ],
      },
      {
        id: "w_cot_status",
        type: "status-distribution",
        title: "Cotações por status",
        intent: "Verificar cotações sem resposta do fornecedor",
        datasetRef: "ds_cotacoes_v3",
        dimension: "status",
        measure: "documentos",
        aggregation: "count",
        format: "integer",
        size: "md",
        priority: 20,
        series: [
          { label: "Aguardando Resposta", value: 3, tone: "attention" },
          { label: "Finalizado", value: 2, tone: "positive" },
          { label: "Em Análise de Negociação", value: 1, tone: "info" },
        ],
      },
      {
        id: "w_mix",
        type: "donut",
        title: "Composição do fluxo",
        intent: "Proporção entre requisições e cotações no recorte",
        datasetRef: "ds_requisicoes_v3",
        dimension: "entidade",
        measure: "documentos",
        aggregation: "count",
        format: "integer",
        size: "sm",
        priority: 30,
        series: [
          { label: "Requisições", value: 41 },
          { label: "Cotações", value: 6 },
        ],
      },
    ],
  };

  const value: SectionBlueprint = {
    id: "sec_value",
    title: "Valores e concentração",
    description: "Onde o dinheiro do recorte está concentrado.",
    kind: "value",
    widgets: [
      {
        id: "w_supplier",
        type: "ranking",
        title: "Fornecedores por valor cotado",
        intent: "Detectar concentração anormal de valor em um fornecedor",
        datasetRef: "ds_cotacoes_v3",
        dimension: "fornecedor",
        measure: "valor",
        aggregation: "sum",
        format: "currency",
        size: "md",
        priority: 10,
        series: supplierRanking,
      },
      {
        id: "w_category",
        type: "ranking",
        title: "Categorias por valor requisitado",
        intent: "Entender a distribuição da demanda por categoria",
        datasetRef: "ds_requisicoes_v3",
        dimension: "categoria",
        measure: "valor",
        aggregation: "sum",
        format: "currency",
        size: "md",
        priority: 20,
        series: categoryRanking,
      },
    ],
  };

  const trend: SectionBlueprint = {
    id: "sec_trend",
    title: "Tendência",
    description: "Evolução diária do recorte de 01/08 a 26/08.",
    kind: "trend",
    widgets: [
      {
        id: "w_trend",
        type: "trend",
        title: "Documentos criados por dia",
        intent: "Identificar picos e vales de demanda no período",
        datasetRef: "ds_requisicoes_v3",
        dimension: "data",
        measure: "documentos",
        aggregation: "count",
        format: "integer",
        size: "xl",
        priority: 10,
        series: dailySeries,
      },
    ],
  };

  const editorial: SectionBlueprint = {
    id: "sec_insights",
    title: "Onde olhar primeiro",
    kind: "editorial",
    widgets: [
      {
        id: "w_insights",
        type: "insight-list",
        title: "Leitura executiva",
        intent: "Priorizar a atenção do time de compras",
        datasetRef: "ds_requisicoes_v3",
        size: "xl",
        priority: 10,
        insights: [
          {
            id: "i1",
            rank: 1,
            title: "28 de 41 requisições estão em aprovação",
            evidence: "68% do fluxo aguarda decisão de aprovador.",
            interpretation: "A aprovação é hoje o principal gargalo do processo.",
            severity: "critical",
          },
          {
            id: "i2",
            rank: 2,
            title: "Uma cotação concentra 91% do valor cotado",
            evidence: `COT-2026-00211 responde por ${((48250 / QUOTE_TOTAL_VALUE) * 100).toFixed(0)}% de ${QUOTE_TOTAL_VALUE.toFixed(0)} em cotações.`,
            interpretation: "Revisar se o valor representa um evento excepcional.",
            severity: "attention",
          },
          {
            id: "i3",
            rank: 3,
            title: "3 cotações aguardam resposta de fornecedor",
            evidence: "50% das cotações do recorte estão sem retorno.",
            interpretation: "Existe risco concreto de atraso no ciclo de compra.",
            severity: "attention",
          },
          {
            id: "i4",
            rank: 4,
            title: "Pedidos não confirmados nesta atualização",
            evidence: "O dataset de pedidos não retornou validação completa.",
            interpretation: "Nenhuma conclusão sobre pedidos deve ser tirada agora.",
            severity: "info",
          },
        ],
      },
    ],
  };

  const actions: SectionBlueprint = {
    id: "sec_actions",
    title: "Recomendações",
    kind: "actions",
    widgets: [
      {
        id: "w_recs",
        type: "recommendation-list",
        title: "Próximos passos sugeridos",
        intent: "Converter os achados em ações de compras",
        datasetRef: "ds_requisicoes_v3",
        size: "xl",
        priority: 10,
        recommendations: [
          {
            id: "r1",
            title: "Priorizar as requisições mais antigas em aprovação",
            rationale: "12 requisições estão há mais de 10 dias aguardando decisão.",
            effort: "Rápido",
            severity: "critical",
          },
          {
            id: "r2",
            title: "Revisar a cotação com concentração anormal de valor",
            rationale: "COT-2026-00211 distorce o valor médio das cotações do período.",
            effort: "Médio",
            severity: "attention",
          },
          {
            id: "r3",
            title: "Acionar fornecedores das cotações sem resposta",
            rationale: "3 cotações vencem nos próximos 20 dias sem retorno.",
            effort: "Rápido",
            severity: "attention",
          },
        ],
      },
    ],
  };

  const detail: SectionBlueprint = {
    id: "sec_detail",
    title: "Detalhamento",
    description: "Amostra do recorte. A exploração completa está na aba Dados.",
    kind: "detail",
    widgets: [
      {
        id: "w_table",
        type: "table",
        title: "Requisições recentes",
        intent: "Amostra operacional do período",
        datasetRef: "ds_requisicoes_v3",
        size: "xl",
        priority: 10,
        table: {
          columns: requisitionTable.columns.filter((c) => c.key !== "itens"),
          rows: requisitionTable.rows.slice(0, 6),
        },
      },
    ],
  };

  return {
    id,
    title: "Dashboard da conversa",
    subtitle: "",
    scope: SCOPE_LABEL,
    executiveSummary:
      "Entre 01/08 e 26/08, o fluxo ficou concentrado em requisições em aprovação e cotações aguardando resposta. Não há pedidos confirmados no recorte, portanto a análise de pedidos foi suprimida.",
    generatedAt: new Date().toISOString(),
    sections: [overview, flow, value, trend, editorial, actions, detail],
    followUps: [
      "Detalhar requisições ainda em aprovação?",
      "Comparar fornecedores por concentração de valor?",
      "Revisar cotações aguardando resposta?",
      "Analisar evolução por categoria?",
    ],
    datasets,
  };
}

function metric(
  id: string,
  title: string,
  intent: string,
  value: number | null,
  format: "integer" | "currency" | "percent",
  extra: { deltaLabel?: string; hint?: string } = {},
): WidgetBlueprint {
  return {
    id,
    type: "metric",
    title,
    intent,
    datasetRef: "ds_requisicoes_v3",
    measure: title,
    aggregation: format === "currency" ? "sum" : "count",
    format,
    size: "sm" as WidgetSize,
    priority: 1,
    metric: {
      value,
      confidence: value === null ? "unconfirmed" : "confirmed",
      format,
      ...extra,
    },
  };
}

export function countWidgets(bp: DashboardBlueprint) {
  return bp.sections.reduce((a, s) => a + s.widgets.length, 0);
}

export const QUOTE_TOTAL = QUOTE_TOTAL_VALUE;
