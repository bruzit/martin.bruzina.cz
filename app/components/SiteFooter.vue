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
</script>

<template>
  <footer>
    <p>
      <a :href="footer.home">{{ footer.name }}</a>, {{ footer.address }}, IČO
      <a :href="footer.icoHref">{{ footer.ico }}</a>, {{ footer.register }}.</p>
    <ul aria-label="Address on a map">
      <li v-for="map in maps" :key="map.label">
        <a :href="map.href">{{ map.label }}</a>
      </li>
    </ul>
    <p>© {{ footer.year }} <a :href="footer.home">{{ footer.holder }}</a></p>
  </footer>
</template>
