<script setup lang="ts">
import { computed } from 'vue';
import BuildingPlanBuilder from './BuildingPlanBuilder.vue';
import { getTranslation } from '../lib/i18n';
import type { Locale } from '../lib/types';

const props = defineProps<{ locale: Locale }>();
const copy = computed(() => getTranslation(props.locale));
const productName = computed(() => props.locale === 'de' ? 'Türnummernplan' : 'Door Number Plan');
const sampleLevels = computed(() => props.locale === 'de'
  ? ['4. Stock', '3. Stock', '2. Stock', '1. Stock', 'Erdgeschoß']
  : ['4th floor', '3rd floor', '2nd floor', '1st floor', 'Ground floor']);
const sampleDoors = [
  ['25', '26', '27', '28'],
  ['19', '20', '21', '22', '23', '24'],
  ['13', '14', '15', '16', '17', '18'],
  ['7', '8', '9', '10', '11', '12'],
  ['1', '2', '3', '4', '5', '6'],
];
</script>

<template>
  <header class="page-shell flex h-20 items-center justify-between">
    <a :href="`/${locale}/`" class="flex items-center gap-3 font-display text-lg font-bold tracking-tight" :aria-label="`${productName} home`">
      <span class="grid size-9 place-items-center rounded-xl bg-forest text-white">
        <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      {{ productName }}
    </a>

    <nav class="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Main navigation">
      <a href="#why" class="transition hover:text-forest">{{ copy.navWhy }}</a>
      <a href="#how" class="transition hover:text-forest">{{ copy.navHow }}</a>
      <a href="#builder" class="transition hover:text-forest">{{ copy.navCreate }}</a>
    </nav>

    <div class="flex items-center gap-2 rounded-full border border-line bg-white p-1 text-xs font-semibold" aria-label="Language">
      <a href="/en/" :aria-current="locale === 'en' ? 'page' : undefined" class="rounded-full px-3 py-1.5 transition" :class="{ 'bg-forest text-white': locale === 'en' }">EN</a>
      <a href="/de/" :aria-current="locale === 'de' ? 'page' : undefined" class="rounded-full px-3 py-1.5 transition" :class="{ 'bg-forest text-white': locale === 'de' }">DE</a>
    </div>
  </header>

  <main>
    <section class="relative overflow-hidden pb-24 pt-16 sm:pt-24">
      <div class="grid-fade pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]"></div>
      <div class="page-shell grid items-center gap-16 lg:grid-cols-[1.02fr_.98fr]">
        <div>
          <div class="mb-7 inline-flex items-center gap-2 rounded-full border border-forest/15 bg-mint/70 px-3 py-1.5 text-xs font-semibold text-forest">
            <span class="size-1.5 rounded-full bg-forest"></span>
            <span>{{ copy.eyebrow }}</span>
          </div>
          <h1 class="max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.7rem]">
            {{ copy.heroLine1 }}<br />
            <span class="text-forest">{{ copy.heroLine2 }}</span>
          </h1>
          <p class="mt-7 max-w-xl text-lg leading-8 text-ink/65">{{ copy.heroBody }}</p>
          <div class="mt-9 flex flex-wrap items-center gap-4">
            <a href="#builder" class="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#103f2a]">
              <span>{{ copy.heroCta }}</span>
              <svg viewBox="0 0 20 20" class="size-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
            <span class="flex items-center gap-2 text-sm text-ink/55">
              <svg viewBox="0 0 20 20" class="size-4 text-forest" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 2.5 4 5v4.5c0 3.7 2.5 6.7 6 8 3.5-1.3 6-4.3 6-8V5l-6-2.5Z" stroke-linejoin="round"/><path d="m7.4 10 1.7 1.7 3.5-3.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>{{ copy.privacyNote }}</span>
            </span>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-[590px]">
          <div class="absolute -left-10 top-16 -z-10 size-32 rounded-full bg-[#f5d98a]/70 blur-3xl"></div>
          <div class="absolute -right-10 bottom-6 -z-10 size-44 rounded-full bg-[#a8dfc0]/70 blur-3xl"></div>
          <div class="soft-shadow rotate-[1.5deg] rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
            <div class="aspect-[1.414/1] rounded-lg border border-line bg-[#fdfdfb] p-[7%]">
              <div class="flex items-start justify-between border-b-2 border-forest pb-[4%]">
                <div>
                  <p class="font-display text-[clamp(1rem,2.4vw,1.75rem)] font-bold tracking-tight">{{ copy.sampleTitle }}</p>
                  <p class="mt-1 text-[clamp(.5rem,1vw,.7rem)] text-black/45">Lindenstraße 18 · 10115 Berlin</p>
                </div>
                <div class="grid size-8 place-items-center rounded-full bg-mint text-forest sm:size-10">
                  <svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 21V7l7-4 7 4v14M9 21v-4h6v4" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <div class="mt-[5%] space-y-1.5 text-[clamp(.48rem,1.25vw,.78rem)]">
                <div v-for="(level, index) in sampleLevels" :key="level" class="grid grid-cols-[29%_1fr] overflow-hidden rounded-md bg-[#eef1ed]">
                  <div class="px-3 py-2 font-semibold">{{ level }}</div>
                  <div class="flex gap-3 border-l border-white px-3 py-2"><span v-for="door in sampleDoors[index]" :key="door">{{ door }}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-lg sm:-left-8">
            <span class="grid size-9 place-items-center rounded-full bg-mint text-forest"><svg viewBox="0 0 20 20" class="size-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <div><p class="text-xs font-semibold">{{ copy.printReady }}</p><p class="text-[11px] text-ink/45">{{ copy.a4Landscape }}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section id="why" class="border-y border-line bg-white py-24">
      <div class="page-shell">
        <div class="max-w-2xl">
          <p class="text-xs font-bold uppercase tracking-[.18em] text-forest">{{ copy.whyEyebrow }}</p>
          <h2 class="mt-4 font-display text-4xl font-semibold tracking-[-.035em] sm:text-5xl">{{ copy.whyTitle }}</h2>
        </div>
        <div class="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          <article class="bg-white p-8">
            <span class="grid size-11 place-items-center rounded-xl bg-[#fcebc8] text-[#815c0f]"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 3v18M3 12h18" stroke-linecap="round"/><circle cx="12" cy="12" r="9"/></svg></span>
            <h3 class="mt-6 font-display text-xl font-semibold">{{ copy.whyEmergencyTitle }}</h3><p class="mt-3 text-sm leading-6 text-ink/60">{{ copy.whyEmergencyBody }}</p>
          </article>
          <article class="bg-white p-8">
            <span class="grid size-11 place-items-center rounded-xl bg-mint text-forest"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke-linejoin="round"/></svg></span>
            <h3 class="mt-6 font-display text-xl font-semibold">{{ copy.whyDeliveryTitle }}</h3><p class="mt-3 text-sm leading-6 text-ink/60">{{ copy.whyDeliveryBody }}</p>
          </article>
          <article class="bg-white p-8">
            <span class="grid size-11 place-items-center rounded-xl bg-[#e8e5f8] text-[#504790]"><svg viewBox="0 0 24 24" class="size-5" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M8 20v-2a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v2M13.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5 11v6M2 14h6" stroke-linecap="round"/></svg></span>
            <h3 class="mt-6 font-display text-xl font-semibold">{{ copy.whyGuestTitle }}</h3><p class="mt-3 text-sm leading-6 text-ink/60">{{ copy.whyGuestBody }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="how" class="py-24">
      <div class="page-shell">
        <div class="mb-14 text-center"><p class="text-xs font-bold uppercase tracking-[.18em] text-forest">{{ copy.howEyebrow }}</p><h2 class="mt-4 font-display text-4xl font-semibold tracking-[-.035em]">{{ copy.howTitle }}</h2></div>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="text-center"><span class="mx-auto grid size-10 place-items-center rounded-full border border-forest/20 bg-white font-display text-sm font-bold text-forest">1</span><h3 class="mt-5 font-display text-lg font-semibold">{{ copy.step1Title }}</h3><p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/55">{{ copy.step1Body }}</p></div>
          <div class="text-center"><span class="mx-auto grid size-10 place-items-center rounded-full border border-forest/20 bg-white font-display text-sm font-bold text-forest">2</span><h3 class="mt-5 font-display text-lg font-semibold">{{ copy.step2Title }}</h3><p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/55">{{ copy.step2Body }}</p></div>
          <div class="text-center"><span class="mx-auto grid size-10 place-items-center rounded-full border border-forest/20 bg-white font-display text-sm font-bold text-forest">3</span><h3 class="mt-5 font-display text-lg font-semibold">{{ copy.step3Title }}</h3><p class="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink/55">{{ copy.step3Body }}</p></div>
        </div>
      </div>
    </section>

    <BuildingPlanBuilder :locale="locale" />
  </main>

  <footer class="bg-[#103d2a] py-10 text-white/60">
    <div class="page-shell flex flex-col items-center justify-between gap-4 text-xs sm:flex-row">
      <div class="flex items-center gap-2 font-display text-sm font-semibold text-white"><span class="grid size-7 place-items-center rounded-lg bg-white/10"><svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 21V7l7-4 7 4v14M9 21v-4h6v4" stroke-linejoin="round"/></svg></span>{{ productName }}</div>
      <p>{{ copy.footer }}</p>
      <p>© {{ new Date().getFullYear() }} {{ productName }}</p>
    </div>
  </footer>
</template>
