<script setup lang="ts">
import type { BuildingLevel } from '../lib/types';
import type { Translation } from '../lib/i18n';

defineProps<{
  level: BuildingLevel;
  index: number;
  total: number;
  elevatorsEnabled: boolean;
  copy: Translation;
}>();

const emit = defineEmits<{
  move: [direction: -1 | 1];
  remove: [];
  addDoor: [];
  addElevator: [];
  removeItem: [itemIndex: number];
  moveItem: [itemIndex: number, direction: -1 | 1];
}>();
</script>

<template>
  <div class="group rounded-xl border border-line bg-white p-3">
    <div class="flex gap-2">
      <div class="flex flex-col justify-center gap-0.5">
        <button type="button" :aria-label="copy.moveUp" :title="copy.moveUp" :disabled="index === 0" class="grid size-6 place-items-center rounded text-ink/30 hover:bg-cream hover:text-forest disabled:opacity-20" @click="emit('move', -1)">
          <svg viewBox="0 0 16 16" class="size-3" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m4 10 4-4 4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button type="button" :aria-label="copy.moveDown" :title="copy.moveDown" :disabled="index === total - 1" class="grid size-6 place-items-center rounded text-ink/30 hover:bg-cream hover:text-forest disabled:opacity-20" @click="emit('move', 1)">
          <svg viewBox="0 0 16 16" class="size-3" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>

      <div class="min-w-0 flex-1">
        <input v-model="level.name" :aria-label="copy.levelPlaceholder" :placeholder="copy.levelPlaceholder" class="w-full border-0 border-b border-line bg-transparent px-1 pb-2 text-sm font-semibold outline-none focus:border-forest" />

        <div class="mt-3 flex flex-wrap items-stretch gap-1.5">
          <div
            v-for="(item, itemIndex) in level.items"
            :key="item.id"
            class="flex items-center rounded-lg border border-line"
            :class="item.type === 'elevator' ? 'bg-mint/45' : 'bg-cream/60'"
          >
            <div class="ml-1 flex flex-col">
              <button type="button" :aria-label="copy.moveLeft" :title="copy.moveLeft" :disabled="itemIndex === 0" class="grid size-4 place-items-center rounded text-ink/25 hover:text-forest disabled:opacity-15" @click="emit('moveItem', itemIndex, -1)">
                <svg viewBox="0 0 12 12" class="size-2.5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m7.5 3-3 3 3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button type="button" :aria-label="copy.moveRight" :title="copy.moveRight" :disabled="itemIndex === level.items.length - 1" class="grid size-4 place-items-center rounded text-ink/25 hover:text-forest disabled:opacity-15" @click="emit('moveItem', itemIndex, 1)">
                <svg viewBox="0 0 12 12" class="size-2.5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4.5 3 3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>

            <template v-if="item.type === 'door'">
              <input v-model="item.label" :aria-label="`${copy.doorPlaceholder} ${itemIndex + 1}`" :placeholder="copy.doorPlaceholder" class="w-14 bg-transparent px-1.5 py-2 text-center text-xs outline-none sm:w-16" />
            </template>
            <template v-else>
              <span class="px-2 py-2 text-[11px] font-semibold text-forest">{{ copy.elevator }}</span>
            </template>

            <button type="button" :aria-label="item.type === 'door' ? copy.removeDoor : copy.removeElevator" :title="item.type === 'door' ? copy.removeDoor : copy.removeElevator" class="mr-1 grid size-6 place-items-center rounded text-ink/25 hover:bg-red-50 hover:text-red-600" @click="emit('removeItem', itemIndex)">
              <svg viewBox="0 0 16 16" class="size-3" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4l8 8m0-8-8 8" stroke-linecap="round"/></svg>
            </button>
          </div>

          <button type="button" class="rounded-lg border border-dashed border-forest/30 px-2.5 py-2 text-[11px] font-semibold text-forest hover:bg-mint/50" @click="emit('addDoor')">
            + {{ copy.addDoor }}
          </button>
          <button v-if="elevatorsEnabled" type="button" class="rounded-lg border border-dashed border-forest/30 px-2.5 py-2 text-[11px] font-semibold text-forest hover:bg-mint/50" @click="emit('addElevator')">
            + {{ copy.addElevator }}
          </button>
        </div>
      </div>

      <button type="button" :aria-label="copy.removeLevel" :title="copy.removeLevel" :disabled="total === 1" class="grid size-7 shrink-0 place-items-center rounded-full text-ink/25 opacity-60 hover:bg-red-50 hover:text-red-600 disabled:opacity-15 group-hover:opacity-100" @click="emit('remove')">
        <svg viewBox="0 0 16 16" class="size-3.5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4l8 8m0-8-8 8" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
</template>
