<script setup lang="ts">
import type { NuxtError } from "#app";
import cardData from "~~/content/card.yaml";
import errorData from "~~/content/error.yaml";
import type { Card } from "~~/schemas/card";
import type { ErrorContent } from "~~/schemas/error";

const props = defineProps<{ error: NuxtError }>();
const card = cardData as Card;
const content = errorData as ErrorContent;
const notFound = computed(() => props.error.statusCode === 404);
const page = computed(() => (notFound.value ? content.notFound : content.failure));
const path = useRoute().path;
useHead({ title: () => `${page.value.title} · ${card.name}`, meta: [{ name: "robots", content: "noindex" }] });

const link = (kind: string) => card.links.find((item) => item.kind === kind)!;
const home = { label: content.home, href: "/", icon: "i-bi-house", left: true };
const boards = computed(() =>
  notFound.value
    ? [
        home,
        { label: card.consulting.inquiry.label, href: inquiryHref(card.consulting.inquiry), icon: "i-bi-envelope", left: false },
        { label: link("linkedin").label, href: link("linkedin").href!, icon: "i-bi-linkedin", left: true },
        { label: link("github").label, href: link("github").href!, icon: "i-bi-github", left: false },
      ]
    : [home],
);
</script>

<template>
  <UApp>
    <CardFrame>
      <div class="grid items-center gap-7 p-7 md:grid-cols-[1.1fr_1fr]">
        <div class="grid min-w-0 gap-3">
          <p class="text-xs font-semibold tracking-widest text-muted uppercase">{{ page.label }}</p>
          <h1 class="text-[1.9rem] leading-tight font-extrabold wrap-anywhere text-heading">
            {{ page.heading }}<template v-if="notFound">{{ " " }}<code class="font-mono text-[0.85em] font-medium">{{ path }}</code></template>
          </h1>
          <p class="max-w-[46ch]">{{ page.text }}</p>
        </div>
        <nav
          aria-label="Where to go"
          class="relative grid justify-items-center gap-3 pt-1 pb-7 before:absolute before:inset-y-0 before:left-1/2 before:w-2.5 before:-translate-x-1/2 before:rounded-t-[3px] before:bg-(--ui-text-muted)"
        >
          <a
            v-for="board in boards"
            :key="board.href"
            :href="board.href"
            class="group relative block w-[min(100%,13rem)] font-bold text-[#0b0c0d] no-underline"
            :class="board.left ? '-translate-x-[10%]' : 'translate-x-[10%]'"
          >
            <span
              class="flex items-center bg-tango-400 py-2.5 group-hover:bg-tango-300"
              :class="
                board.left
                  ? 'justify-end pr-4 pl-[30px] [clip-path:polygon(18px_0,100%_0,100%_100%,18px_100%,0_50%)]'
                  : 'pr-[30px] pl-4 [clip-path:polygon(0_0,calc(100%_-_18px)_0,100%_50%,calc(100%_-_18px)_100%,0_100%)]'
              "
            >
              <UIcon :name="board.icon" class="me-1.5" />{{ board.label }}
            </span>
          </a>
        </nav>
      </div>
    </CardFrame>
  </UApp>
</template>
