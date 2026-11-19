<script setup lang="ts">
import data from "~~/content/footer.yaml";
import type { Footer } from "~~/schemas/footer";

const footer = data as Footer;
const address = encodeURIComponent(footer.address);
const maps = [
  { label: "Google Maps", href: `https://www.google.com/maps/search/?api=1&query=${address}` },
  { label: "Mapy.com", href: `https://mapy.com/fnc/v1/search?query=${address}` },
  { label: "Apple Maps", href: `https://maps.apple.com/search?query=${address}` },
];
const link = "inline-block min-h-6 font-semibold text-link underline underline-offset-3";
</script>

<template>
  <footer class="grid gap-1 border-t border-line px-7 pt-3.5 pb-4 text-[0.8rem] text-muted">
    <p class="wrap-anywhere">
      <a :href="footer.home" :class="link">{{ footer.name }}</a> ·
      <UIcon name="i-bi-geo-alt" class="me-1 align-[-0.15em]" />{{ footer.address }} · IČO
      <a :href="footer.icoHref" :class="link">{{ footer.ico }}</a> · {{ footer.register }}</p>
    <ul aria-label="Address on a map" class="flex flex-wrap gap-x-4">
      <li v-for="map in maps" :key="map.label">
        <a :href="map.href" :class="link">{{ map.label }}</a>
      </li>
    </ul>
    <p class="text-right">© {{ footer.year }} <a :href="footer.home" :class="link">{{ footer.holder }}</a></p>
  </footer>
</template>
