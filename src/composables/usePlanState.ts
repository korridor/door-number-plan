import { computed, onMounted, ref, watch, type Ref } from 'vue';
import { createDefaultPlan } from '../lib/defaults';
import type { BuildingPlan, LevelItem, Locale } from '../lib/types';

const STORAGE_PREFIX = 'door-number-plan-v4';
const LEGACY_STORAGE_KEYS = ['floorfind-plan-v3', 'floorfind-plan-v2'];

function isItem(value: unknown): value is LevelItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<LevelItem>;
  if (typeof item.id !== 'string') return false;
  if (item.type === 'door') return typeof item.label === 'string';
  if (item.type === 'elevator') return true;
  return false;
}

function normalizePlan(value: unknown): BuildingPlan | null {
  if (!value || typeof value !== 'object') return null;
  const raw = value as Record<string, unknown>;
  if (typeof raw.title !== 'string' || typeof raw.street !== 'string' || typeof raw.city !== 'string' || !Array.isArray(raw.levels)) return null;

  const levels = raw.levels.map((value, levelIndex) => {
    if (!value || typeof value !== 'object') return null;
    const level = value as Record<string, unknown>;
    if (typeof level.name !== 'string') return null;

    let items: LevelItem[];
    if (Array.isArray(level.items) && level.items.every(isItem)) {
      items = level.items.map((item) => item.type === 'door'
        ? { id: item.id, type: 'door', label: item.label }
        : { id: item.id, type: 'elevator' });
    } else if (Array.isArray(level.doors) && level.doors.every((door) => typeof door === 'string')) {
      items = level.doors.map((label, doorIndex) => ({
        id: `migrated-${levelIndex}-${doorIndex}`,
        type: 'door' as const,
        label,
      }));
    } else {
      return null;
    }

    return {
      id: typeof level.id === 'string' ? level.id : `migrated-level-${levelIndex}`,
      name: level.name,
      items,
    };
  });

  if (levels.some((level) => level === null)) return null;
  return {
    title: raw.title,
    street: raw.street,
    city: raw.city,
    blackAndWhite: raw.blackAndWhite === true,
    elevatorsEnabled: raw.elevatorsEnabled === true,
    levels: levels as BuildingPlan['levels'],
  };
}

function encodePlan(plan: BuildingPlan): string {
  const bytes = new TextEncoder().encode(JSON.stringify(plan));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function decodePlan(encoded: string): BuildingPlan | null {
  try {
    const padded = encoded.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return normalizePlan(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

export function usePlanState(locale: Ref<Locale>) {
  const plan = ref<BuildingPlan>(createDefaultPlan(locale.value));
  const hydrated = ref(false);
  const storageKey = computed(() => `${STORAGE_PREFIX}:${locale.value}`);

  onMounted(() => {
    const shared = new URL(window.location.href).searchParams.get('plan');
    const sharedPlan = shared ? decodePlan(shared) : null;
    const stored = localStorage.getItem(storageKey.value)
      ?? LEGACY_STORAGE_KEYS
        .map((prefix) => localStorage.getItem(`${prefix}:${locale.value}`))
        .find((value) => value !== null);

    if (sharedPlan) {
      plan.value = sharedPlan;
    } else if (stored) {
      try {
        const normalized = normalizePlan(JSON.parse(stored));
        if (normalized) plan.value = normalized;
      } catch {
        localStorage.removeItem(storageKey.value);
      }
    }
    hydrated.value = true;
  });

  watch(plan, (value) => {
    if (hydrated.value) localStorage.setItem(storageKey.value, JSON.stringify(value));
  }, { deep: true });

  function reset() {
    plan.value = createDefaultPlan(locale.value);
  }

  function addLevel(name: string) {
    plan.value.levels.push({
      id: crypto.randomUUID(),
      name,
      items: [{ id: crypto.randomUUID(), type: 'door', label: '' }],
    });
  }

  function removeLevel(index: number) {
    if (plan.value.levels.length > 1) plan.value.levels.splice(index, 1);
  }

  function moveLevel(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= plan.value.levels.length) return;
    const [level] = plan.value.levels.splice(index, 1);
    plan.value.levels.splice(target, 0, level);
  }

  function addDoor(levelIndex: number) {
    plan.value.levels[levelIndex].items.push({ id: crypto.randomUUID(), type: 'door', label: '' });
  }

  function addElevator(levelIndex: number) {
    plan.value.levels[levelIndex].items.push({ id: crypto.randomUUID(), type: 'elevator' });
  }

  function removeItem(levelIndex: number, itemIndex: number) {
    const items = plan.value.levels[levelIndex].items;
    if (items.length === 1 && items[0].type === 'door') {
      items[0].label = '';
      return;
    }
    items.splice(itemIndex, 1);
    if (items.length === 0) items.push({ id: crypto.randomUUID(), type: 'door', label: '' });
  }

  function moveItem(levelIndex: number, itemIndex: number, direction: -1 | 1) {
    const items = plan.value.levels[levelIndex].items;
    const target = itemIndex + direction;
    if (target < 0 || target >= items.length) return;
    const [item] = items.splice(itemIndex, 1);
    items.splice(target, 0, item);
  }

  function shareUrl(): string {
    const url = new URL(window.location.href);
    url.hash = '';
    url.search = '';
    url.searchParams.set('plan', encodePlan(plan.value));
    return url.toString();
  }

  return {
    plan,
    reset,
    addLevel,
    removeLevel,
    moveLevel,
    addDoor,
    addElevator,
    removeItem,
    moveItem,
    shareUrl,
  };
}
