<script setup lang="ts">
import { computed } from 'vue';
import type { BuildingPlan, BuildingLevel } from '../lib/types';
import type { Translation } from '../lib/i18n';

const props = defineProps<{
  plan: BuildingPlan;
  copy: Translation;
}>();

const LEVELS_PER_PAGE = 8;
const pages = computed(() => {
  const result: BuildingLevel[][] = [];
  for (let index = 0; index < props.plan.levels.length; index += LEVELS_PER_PAGE) {
    result.push(props.plan.levels.slice(index, index + LEVELS_PER_PAGE));
  }
  return result.length ? result : [[]];
});

function visibleItems(level: BuildingLevel) {
  return level.items.filter((item) => item.type === 'door' ? item.label : props.plan.elevatorsEnabled);
}
</script>

<template>
  <div class="w-full max-w-[720px]">
    <div class="mb-3 flex items-center justify-between">
      <span class="text-[11px] font-semibold uppercase tracking-[.12em] text-ink/40">{{ copy.preview }}</span>
      <span class="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-ink/40">A4 · 297 × 210 mm</span>
    </div>

    <div class="space-y-7">
      <div v-for="(levels, pageIndex) in pages" :key="levels.map((level) => level.id).join(':') || `page-${pageIndex}`">
        <div v-if="pages.length > 1" class="mb-1.5 text-right text-[10px] font-semibold text-ink/35">{{ copy.page }} {{ pageIndex + 1 }} / {{ pages.length }}</div>
        <div class="aspect-[1.414/1] w-full bg-white p-[6.5%] shadow-xl" :class="{ 'grayscale': plan.blackAndWhite }">
          <div class="flex h-full flex-col">
            <div class="flex items-start justify-between border-b-2 border-forest pb-[3.5%]">
              <div class="min-w-0">
                <h4 class="truncate font-display text-[clamp(.9rem,3vw,2rem)] font-bold tracking-[-.03em]">{{ plan.title }}</h4>
                <p class="mt-1 truncate text-[clamp(.42rem,1.2vw,.75rem)] text-ink/45">{{ plan.street }} · {{ plan.city }}</p>
              </div>
              <span class="ml-3 grid size-[clamp(1.8rem,4vw,3rem)] shrink-0 place-items-center rounded-full bg-mint text-forest">
                <svg viewBox="0 0 24 24" class="h-1/2 w-1/2" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 21V7l7-4 7 4v14M9 21v-4h6v4" stroke-linejoin="round"/></svg>
              </span>
            </div>

            <div class="mt-[4%] grid min-h-0 flex-1 gap-[clamp(2px,.55vw,6px)]" :style="{ gridTemplateRows: `repeat(${Math.max(levels.length, 1)}, minmax(0, 1fr))` }">
              <div v-for="level in levels" :key="level.id" class="grid min-h-0 grid-cols-[30%_1fr] overflow-hidden rounded-[clamp(2px,.45vw,6px)] bg-[#eef1ed] text-[clamp(.36rem,1.15vw,.82rem)]">
                <div class="flex min-h-0 items-center truncate px-[7%] font-semibold">{{ level.name }}</div>
                <div class="flex min-h-0 flex-wrap items-center gap-x-[clamp(5px,1.4vw,16px)] gap-y-0 overflow-hidden border-l border-white px-[4%] font-medium">
                  <template v-for="item in visibleItems(level)" :key="item.id">
                    <span v-if="item.type === 'door'">{{ item.label }}</span>
                    <span v-else class="inline-flex items-center gap-0.5 rounded bg-white/70 px-1 py-0.5 text-[.82em] font-semibold text-forest">
                      {{ copy.elevator }}
                    </span>
                  </template>
                </div>
              </div>
            </div>

            <div class="mt-auto flex justify-between pt-[3%] text-[clamp(.35rem,.9vw,.58rem)] text-ink/30">
              <span>{{ plan.street }}</span>
              <span>{{ plan.city }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
