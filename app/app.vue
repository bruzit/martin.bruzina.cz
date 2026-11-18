<script setup lang="ts">
import data from "~~/content/card.yaml";
import type { Card } from "~~/schemas/card";

const card = data as Card;
const query = new URLSearchParams({ subject: card.inquiry.subject, body: card.inquiry.body });
const inquiryHref = `mailto:${card.inquiry.email}?${query.toString().replaceAll("+", "%20")}`;
</script>

<template>
  <main>
    <article>
      <h1>{{ card.name }}</h1>
      <p>{{ card.headline }}</p>
      <p>{{ card.bio }}</p>
      <p>{{ card.engagement }}</p>
      <p><a :href="inquiryHref">{{ card.inquiry.label }}</a></p>
      <ul>
        <li v-for="contact in card.contacts" :key="contact.kind">
          <a :href="contact.href">{{ contact.label }}</a>
        </li>
        <li>{{ card.blog }}</li>
      </ul>
      <p>{{ card.location }}</p>
    </article>
  </main>
</template>
