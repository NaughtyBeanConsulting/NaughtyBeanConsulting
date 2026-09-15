---
title: "Naughty Bean Coffee Store"
tagline: "Our own coffee brand's online store, built to retire Shopify."
description: "A Django e-commerce platform combining the naughtybean.coffee marketing site and shop: CMS-editable pages, multi-gateway checkout, live courier rates and WhatsApp notifications."
sheet: "P-03"
weight: 3
status: live
rev: "C"
link: "https://www.naughtybean.coffee"
linkLabel: "naughtybean.coffee"
customer: "Naughty Bean Coffee, our sister brand"
mark: "img/nbcoffee.webp"
stackShort: [Django, PostgreSQL, Tailwind]
stack:
  - [Framework, "Django 6"]
  - [Database, "PostgreSQL"]
  - [Front end, "Tailwind CSS v4, HTMX, Alpine.js; storefront derived from the Shopify Dawn layout customers already knew"]
  - [CMS, "django-unfold admin with TinyMCE; pages, menus, banners, theme colours and shipping rules are all editable"]
  - [Media, "Automatic WebP conversion of uploads"]
  - [Auth, "Google sign-in via django-allauth, Cloudflare Turnstile"]
  - [Hosting, "Gunicorn and WhiteNoise on aaPanel, Sentry"]
integrations: [Yoco, PayFast, Stitch, "The Courier Guy (Shiplogic)", Mailgun, WhatsApp, "Google sign-in", "Cloudflare Turnstile", "Google Places"]
features:
  - "Full catalogue with options and variants, coupons including free-shipping rules, and an announcement banner."
  - "Marketing pages, menus, theme colours and blog all edited from the admin, no developer required."
  - "Cart and checkout with Yoco, PayFast or Stitch, and a simulated gateway when keys are absent so staging works end to end."
  - "Live courier rates, waybill booking and tracking webhooks from The Courier Guy."
  - "Order and shipping notifications by e-mail and WhatsApp."
  - "Customer accounts, order history, newsletter signup and a rule-based FAQ chat widget."
  - "Address autocomplete with Google Places; uploads converted to WebP automatically."
diagram:
  nodes:
    - { id: shopper, label: "Shopper", col: 0, kind: user }
    - { id: staff, label: "Store admin (CMS)", col: 0, kind: user }
    - { id: app, label: "Store (Django)", col: 1, accent: true }
    - { id: db, label: "PostgreSQL", col: 2, kind: store }
    - { id: pay, label: "Yoco · PayFast · Stitch", col: 2, kind: ext }
    - { id: courier, label: "The Courier Guy rates + tracking", col: 2, kind: ext }
    - { id: notify, label: "Mailgun + WhatsApp", col: 2, kind: ext }
  edges:
    - [shopper, app, "browse · buy"]
    - [staff, app, "edit"]
    - [app, db]
    - [app, pay, "checkout"]
    - [app, courier, "ship"]
    - [app, notify, "notify"]
---

Naughty Bean Coffee is our own coffee brand, and its store used to run on Shopify. This build replaced it: one Django application serving the marketing site and the shop, with every page, menu, theme colour, product, coupon and shipping rule editable from the admin.

Checkout takes Yoco, PayFast or Stitch, with a simulated gateway when keys are absent so a staging environment works end to end. Live courier rates, waybill bookings and tracking come from The Courier Guy's API. Order and shipping notifications go out by e-mail and WhatsApp.

It is the reference build for what we mean by an e-commerce site: fast, owned outright, no per-transaction platform fee, and boring to run.
