<script setup lang="ts">
import data from "~~/content/card.yaml";
import footerData from "~~/content/footer.yaml";
import personData from "~~/content/person.yaml";
import type { Card } from "~~/schemas/card";
import type { Footer } from "~~/schemas/footer";
import type { Person } from "~~/schemas/person";

const card = data as Card;
const footer = footerData as Footer;
const person = personData as Person;
const image = new URL(card.photo.src, person.url).href;
const contact = (kind: string) => card.contact.items.find((item) => item.kind === kind)!.href;
useSeoMeta({
  title: card.name,
  description: person.description,
  ogType: "profile",
  ogTitle: card.name,
  ogDescription: person.ogDescription,
  ogUrl: person.url,
  ogImage: image,
  profileFirstName: person.givenName,
  profileLastName: person.familyName,
});
useHead({
  link: [{ rel: "canonical", href: person.url }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: card.name,
        givenName: person.givenName,
        familyName: person.familyName,
        jobTitle: person.jobTitle,
        description: person.description,
        url: person.url,
        image,
        email: contact("email"),
        telephone: contact("phone").replace("tel:", ""),
        address: {
          "@type": "PostalAddress",
          streetAddress: footer.address.street,
          postalCode: footer.address.postalCode,
          addressLocality: footer.address.locality,
          addressCountry: footer.address.country,
        },
        knowsAbout: person.knowsAbout,
        sameAs: card.links.flatMap((item) => (item.href ? [item.href] : [])),
      }),
    },
  ],
});
const { inquiry } = card.consulting;
const inquiryLink = inquiryHref(inquiry);
const icons = {
  blog: "i-bi-journal-text",
  linkedin: "i-bi-linkedin",
  github: "i-bi-github",
  email: "i-bi-envelope",
  phone: "i-bi-telephone",
};
const link = "inline-block min-h-6 font-semibold text-link underline underline-offset-3";
const label = "text-xs font-semibold tracking-widest text-muted uppercase";
</script>

<template>
  <CardFrame>
    <div class="grid md:grid-cols-[1.15fr_1fr]">
      <div class="grid min-w-0 content-start gap-4 p-7">
        <img
          :src="card.photo.src"
          :alt="card.photo.alt"
          width="96"
          height="96"
          class="size-24 rounded-full border-3 border-tango-400 object-cover"
        />
        <div>
          <h1 class="text-[2rem] leading-tight font-extrabold text-balance text-heading">{{ card.name }}</h1>
          <p class="mt-1">{{ card.headline }}</p>
        </div>
        <p class="max-w-[60ch]">{{ card.bio }}</p>
        <ul class="flex flex-wrap gap-x-5 gap-y-2">
          <li v-for="item in card.links" :key="item.kind">
            <a v-if="item.href" :href="item.href" :class="link">
              <UIcon :name="icons[item.kind]" class="me-1.5 align-[-0.15em]" />{{ item.label }}
            </a>
            <span v-else class="text-muted">
              <UIcon :name="icons[item.kind]" class="me-1.5 align-[-0.15em]" />{{ item.label }}
            </span>
          </li>
        </ul>
      </div>
      <div class="grid min-w-0 content-start gap-6 border-t border-line p-7 md:border-t-0 md:border-l">
        <section aria-labelledby="consulting" class="grid gap-2.5">
          <h2 id="consulting" :class="label">{{ card.consulting.label }}</h2>
          <p>{{ card.consulting.pitch }}</p>
          <p class="text-muted">{{ card.consulting.engagement }}</p>
          <UButton :href="inquiryLink" size="lg" class="justify-self-center">{{ inquiry.label }}</UButton>
          <p class="text-muted">{{ card.consulting.note }}</p>
        </section>
        <section aria-labelledby="contact" class="grid gap-2.5">
          <h2 id="contact" :class="label">{{ card.contact.label }}</h2>
          <ul class="grid gap-2.5">
            <li v-for="item in card.contact.items" :key="item.kind" class="wrap-anywhere">
              <a :href="item.href" :class="link">
                <UIcon :name="icons[item.kind]" class="me-1.5 align-[-0.15em]" />{{ item.label }}
              </a>
            </li>
            <li><UIcon name="i-bi-geo-alt" class="me-1.5 align-[-0.15em]" />{{ card.contact.location }}</li>
          </ul>
        </section>
      </div>
    </div>
  </CardFrame>
</template>
