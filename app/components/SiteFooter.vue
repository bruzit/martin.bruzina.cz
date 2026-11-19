<script setup lang="ts">
import data from "~~/content/footer.yaml";
import type { Footer } from "~~/schemas/footer";

const footer = data as Footer;
const address = encodeURIComponent(footer.address);
const maps = [
  { label: "Google Maps", icon: "i-simple-icons-googlemaps", href: `https://www.google.com/maps/search/?api=1&query=${address}` },
  { label: "Mapy.com", icon: "i-brand-mapy", href: `https://mapy.com/fnc/v1/search?query=${address}` },
  { label: "Apple Maps", icon: "i-simple-icons-apple", href: `https://maps.apple.com/search?query=${address}` },
];
const link = "inline-block min-h-6 font-semibold text-link underline underline-offset-3";
const root = useTemplateRef("root");
const card = computed(() => root.value?.closest("article") ?? undefined);
</script>

<template>
  <footer ref="root" class="relative grid gap-1 border-t border-line px-7 pt-3.5 pb-4 text-[0.8rem] text-muted">
    <p class="wrap-anywhere">
      <a :href="footer.home" :class="link">{{ footer.name }}</a> ·
      <UPopover
        :portal="root ?? false"
        :content="{ side: 'top', align: 'start', sideOffset: 6, collisionBoundary: card, collisionPadding: 8 }"
        :ui="{ content: 'bg-card rounded-lg ring-(--ui-text-muted)' }"
      >
        <button
          type="button"
          class="cursor-pointer text-left text-link underline decoration-dotted underline-offset-3 after:content-['_▾'] aria-expanded:after:content-['_▴']"
        >
          <UIcon name="i-bi-geo-alt" class="me-1 align-[-0.15em]" />{{ footer.address }}
        </button>
        <template #content>
          <ul aria-label="Address on a map" class="grid gap-2 px-3.5 py-2.5 whitespace-nowrap">
            <li v-for="map in maps" :key="map.label">
              <a :href="map.href" :class="link"><UIcon :name="map.icon" class="me-1.5 align-[-0.15em]" />{{ map.label }}</a>
            </li>
          </ul>
        </template>
      </UPopover>
      · IČO <a :href="footer.icoHref" :class="link">{{ footer.ico }}</a> · {{ footer.register }}</p>
    <p class="text-right">© {{ footer.year }} <a :href="footer.home" :class="link">{{ footer.holder }}</a></p>
  </footer>
</template>
