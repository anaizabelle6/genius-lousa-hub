import { useSyncExternalStore } from "react";
import type { DashboardBlueprint, SavedPanel, UserLayoutOverride, WidgetOverride } from "./types";

const PANELS_KEY = "me-genius.saved-panels.v1";
const LAYOUT_KEY = "me-genius.layouts.v1";

type State = {
  panels: SavedPanel[];
  layouts: Record<string, UserLayoutOverride>;
};

let state: State = { panels: [], layouts: {} };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.add;
  listeners.forEach((l) => l());
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PANELS_KEY, JSON.stringify(state.panels));
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(state.layouts));
  } catch {
    /* storage unavailable */
  }
}

export function hydrateStore() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const p = localStorage.getItem(PANELS_KEY);
    const l = localStorage.getItem(LAYOUT_KEY);
    state = {
      panels: p ? (JSON.parse(p) as SavedPanel[]) : [],
      layouts: l ? (JSON.parse(l) as Record<string, UserLayoutOverride>) : {},
    };
  } catch {
    state = { panels: [], layouts: {} };
  }
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;
const getServerSnapshot = () => state;

export function useBiStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function setState(next: State) {
  state = next;
  persist();
  emit();
}

export function savePanel(blueprint: DashboardBlueprint, widgetCount: number) {
  const existing = state.panels.find((p) => p.id === blueprint.id);
  const panel: SavedPanel = {
    id: blueprint.id,
    blueprint,
    savedAt: new Date().toISOString(),
    favorite: true,
    widgetCount,
  };
  setState({
    ...state,
    panels: existing
      ? state.panels.map((p) => (p.id === panel.id ? panel : p))
      : [panel, ...state.panels],
  });
}

export function removePanel(id: string) {
  setState({ ...state, panels: state.panels.filter((p) => p.id !== id) });
}

export function renamePanel(id: string, title: string, subtitle?: string) {
  setState({
    ...state,
    panels: state.panels.map((p) =>
      p.id === id
        ? { ...p, blueprint: { ...p.blueprint, title, subtitle: subtitle ?? p.blueprint.subtitle } }
        : p,
    ),
  });
}

export function duplicatePanel(id: string) {
  const src = state.panels.find((p) => p.id === id);
  if (!src) return;
  const newId = `${id}_copy_${Date.now()}`;
  setState({
    ...state,
    panels: [
      {
        ...src,
        id: newId,
        savedAt: new Date().toISOString(),
        blueprint: { ...src.blueprint, id: newId, title: `${src.blueprint.title} (cópia)` },
      },
      ...state.panels,
    ],
  });
}

export function isPanelSaved(id: string) {
  return state.panels.some((p) => p.id === id);
}

export function getLayout(dashboardId: string): UserLayoutOverride {
  return (
    state.layouts[dashboardId] ?? {
      dashboardId,
      order: {},
      sectionOrder: [],
      sectionTitles: {},
      extraSections: [],
      widgets: {},
    }
  );
}

export function updateLayout(dashboardId: string, patch: Partial<UserLayoutOverride>) {
  const current = getLayout(dashboardId);
  setState({
    ...state,
    layouts: { ...state.layouts, [dashboardId]: { ...current, ...patch } },
  });
}

export function setWidgetOverride(dashboardId: string, widgetId: string, patch: WidgetOverride) {
  const current = getLayout(dashboardId);
  updateLayout(dashboardId, {
    widgets: { ...current.widgets, [widgetId]: { ...current.widgets[widgetId], ...patch } },
  });
}
