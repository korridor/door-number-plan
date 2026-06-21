<script setup lang="ts">
import { computed, ref, toRef } from 'vue';
import LevelEditor from './LevelEditor.vue';
import PlanPreview from './PlanPreview.vue';
import { getTranslation } from '../lib/i18n';
import { generatePdf } from '../lib/generatePdf';
import { usePlanState } from '../composables/usePlanState';
import type { BuildingPlan, Locale } from '../lib/types';

const props = defineProps<{ locale: Locale }>();
const locale = toRef(props, 'locale');
const copy = getTranslation(props.locale);
const { plan, reset, addLevel, removeLevel, moveLevel, addDoor, addElevator, removeItem, moveItem, shareUrl } = usePlanState(locale);
const status = ref('');
const previewPlan = computed<BuildingPlan>(() => JSON.parse(JSON.stringify(plan.value)) as BuildingPlan);

function download() {
  generatePdf(plan.value, copy.sampleTitle, { elevator: copy.elevator, page: copy.page });
  showStatus(copy.downloaded);
}

async function share() {
  const url = shareUrl();
  try {
    await navigator.clipboard.writeText(url);
    showStatus(copy.shared);
  } catch {
    showStatus(copy.shareFallback);
  }
}

function showStatus(message: string) {
  status.value = message;
  window.setTimeout(() => {
    if (status.value === message) status.value = '';
  }, 3500);
}

</script>

<template>
  <section id="builder" class="bg-forest py-20 sm:py-24">
    <div class="page-shell">
      <div class="mb-12 flex flex-col justify-between gap-6 text-white lg:flex-row lg:items-end">
        <div class="max-w-2xl">
          <p class="text-xs font-bold uppercase tracking-[.18em] text-mint/70">{{ copy.builderEyebrow }}</p>
          <h2 class="mt-4 font-display text-4xl font-semibold tracking-[-.035em] sm:text-5xl">{{ copy.builderTitle }}</h2>
        </div>
        <div class="flex max-w-sm items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 text-sm leading-5 text-white/70">
          <svg viewBox="0 0 20 20" class="mt-0.5 size-4 shrink-0 text-mint" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 2.5 4 5v4.5c0 3.7 2.5 6.7 6 8 3.5-1.3 6-4.3 6-8V5l-6-2.5Z" stroke-linejoin="round"/></svg>
          <span>{{ copy.builderPrivacy }}</span>
        </div>
      </div>

      <div class="grid overflow-hidden rounded-2xl bg-[#f7f5ee] shadow-2xl lg:grid-cols-[.82fr_1.18fr]">
        <div class="border-b border-line p-5 sm:p-8 lg:border-b-0 lg:border-r">
          <div class="flex items-center justify-between">
            <h3 class="font-display text-xl font-semibold">{{ copy.detailsTitle }}</h3>
            <button type="button" class="text-xs font-semibold text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-forest" @click="reset">{{ copy.reset }}</button>
          </div>

          <label class="mt-7 block">
            <span class="text-xs font-semibold">{{ copy.planTitleLabel }}</span>
            <input v-model="plan.title" type="text" class="mt-2 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
          </label>
          <label class="mt-4 block">
            <span class="text-xs font-semibold">{{ copy.addressLabel }}</span>
            <input v-model="plan.street" type="text" class="mt-2 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
          </label>
          <label class="mt-4 block">
            <span class="text-xs font-semibold">{{ copy.cityLabel }}</span>
            <input v-model="plan.city" type="text" class="mt-2 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10" />
          </label>

          <div class="mt-5 grid gap-3 sm:grid-cols-2">
            <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3">
              <input v-model="plan.blackAndWhite" type="checkbox" class="mt-0.5 size-4 accent-[#174f36]" />
              <span><span class="block text-xs font-semibold">{{ copy.blackAndWhite }}</span><span class="mt-1 block text-[11px] leading-4 text-ink/45">{{ copy.blackAndWhiteHelp }}</span></span>
            </label>
            <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3">
              <input v-model="plan.elevatorsEnabled" type="checkbox" class="mt-0.5 size-4 accent-[#174f36]" />
              <span><span class="block text-xs font-semibold">{{ copy.elevatorsOption }}</span><span class="mt-1 block text-[11px] leading-4 text-ink/45">{{ copy.elevatorsHelp }}</span></span>
            </label>
          </div>

          <div class="mt-8 flex items-center justify-between border-t border-line pt-7">
            <h3 class="font-display text-xl font-semibold">{{ copy.levelsTitle }}</h3>
            <button type="button" class="inline-flex items-center gap-1.5 rounded-full border border-forest/20 bg-mint px-3 py-1.5 text-xs font-semibold text-forest hover:bg-[#d3eddf]" @click="addLevel(copy.newLevel)">
              <span class="text-base leading-none">+</span><span>{{ copy.addLevel }}</span>
            </button>
          </div>
          <p class="mt-2 text-xs leading-5 text-ink/45">{{ copy.levelsHelp }}</p>

          <div class="mt-4 space-y-3">
            <LevelEditor
              v-for="(level, index) in plan.levels"
              :key="level.id"
              :level="level"
              :index="index"
              :total="plan.levels.length"
              :elevators-enabled="plan.elevatorsEnabled"
              :copy="copy"
              @move="moveLevel(index, $event)"
              @remove="removeLevel(index)"
              @add-door="addDoor(index)"
              @add-elevator="addElevator(index)"
              @remove-item="removeItem(index, $event)"
              @move-item="(itemIndex, direction) => moveItem(index, itemIndex, direction)"
            />
          </div>

          <div class="mt-7 grid gap-3 sm:grid-cols-2">
            <button type="button" class="flex items-center justify-center gap-2 rounded-lg border border-forest/20 bg-white px-5 py-3.5 text-sm font-semibold text-forest transition hover:bg-mint/40" @click="share">
              <svg viewBox="0 0 20 20" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7.5 12.5 12.5 7.5M6 8H5a3 3 0 0 0 0 6h3a3 3 0 0 0 2.7-1.7M14 12h1a3 3 0 0 0 0-6h-3a3 3 0 0 0-2.7 1.7" stroke-linecap="round"/></svg>
              {{ copy.share }}
            </button>
            <button type="button" class="flex items-center justify-center gap-2 rounded-lg bg-forest px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#103f2a]" @click="download">
              <svg viewBox="0 0 20 20" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 3v10m-4-4 4 4 4-4M4 17h12" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ copy.download }}
            </button>
          </div>
          <p v-if="status" class="mt-3 text-center text-xs text-forest" role="status">{{ status }}</p>
        </div>

        <div class="flex min-h-[500px] items-center justify-center bg-[#ebe9e1] p-4 sm:p-8 lg:p-12">
          <PlanPreview :plan="previewPlan" :copy="copy" />
        </div>
      </div>
    </div>
  </section>
</template>
