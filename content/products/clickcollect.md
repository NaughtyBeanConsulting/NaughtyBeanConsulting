---
title: "ClickCollect"
tagline: "Branded online ordering for coffee shops, on their own domain."
description: "ClickCollect is a multi-tenant click-and-collect SaaS for coffee shops: branded storefronts, scheduled pickup, loyalty, multi-gateway payments and WhatsApp updates."
sheet: "P-01"
weight: 1
status: live
rev: "D"
link: "https://clickcollect.coffee"
linkLabel: "clickcollect.coffee"
customer: "Independent coffee shops and small chains"
mark: "img/clickcollect.webp"
stackShort: [Django, PostgreSQL, HTMX]
stack:
  - [Framework, "Django 5.2 with django-tenants, one PostgreSQL schema per shop"]
  - [Database, "PostgreSQL"]
  - [Front end, "Server-rendered templates, HTMX, Alpine.js, Tailwind CSS; installable PWA with service worker"]
  - [APIs, "django-ninja REST APIs for the platform and each storefront"]
  - [Auth, "django-allauth with Google sign-in, Cloudflare Turnstile"]
  - [Hosting, "Gunicorn, Nginx and WhiteNoise on aaPanel; vhosts and TLS provisioned through the aaPanel API"]
  - [Monitoring, "Sentry"]
integrations: [Yoco, PayFast, Stripe, iKhokha, Paystack, "Twilio WhatsApp Business API", SendGrid, OpenRouter, Replicate, "Cloudflare Turnstile", "aaPanel API"]
features:
  - "Branded storefront on a clickcollect.coffee subdomain or a verified custom domain, with TLS issued automatically."
  - "Installable PWA storefront with menu, cart and scheduled pickup slots."
  - "Checkout routed to Yoco, PayFast, Stripe or iKhokha by country and currency."
  - "Loyalty engine: stamp cards, discounts, combos and spend-and-save rules."
  - "Staff order dashboard and an owner portal with menu, branding, locations, team roles and revenue reporting."
  - "WhatsApp order-status notifications, and AI parsing of free-text WhatsApp orders."
  - "Two SaaS billing models, a flat monthly fee or a 2% commission, billed through Paystack."
  - "Headless Platform and Storefront APIs for custom front ends."
diagram:
  nodes:
    - { id: cust, label: "Customer", col: 0, kind: user, note: "PWA storefront" }
    - { id: wa, label: "WhatsApp order", col: 0, kind: ext }
    - { id: owner, label: "Shop owner portal", col: 0, kind: user }
    - { id: app, label: "ClickCollect (Django)", col: 1, accent: true, note: "multi-tenant" }
    - { id: db, label: "PostgreSQL schema per shop", col: 2, kind: store }
    - { id: pay, label: "Yoco · PayFast · Stripe · iKhokha", col: 2, kind: ext }
    - { id: twilio, label: "Twilio WhatsApp", col: 2, kind: ext }
    - { id: llm, label: "OpenRouter order parsing", col: 2, kind: ext }
    - { id: panel, label: "aaPanel vhost + TLS", col: 2, kind: ext }
    - { id: paystack, label: "Paystack subscriptions", col: 2, kind: ext }
  edges:
    - [cust, app, "order"]
    - [wa, app, "message"]
    - [owner, app]
    - [app, db]
    - [app, pay, "checkout"]
    - [app, twilio, "status"]
    - [app, llm, "parse"]
    - [app, panel, "custom domain"]
    - [app, paystack, "billing"]
---

Coffee shops lose orders to queues and lose margin to marketplaces. ClickCollect gives a shop its own branded ordering site, on a subdomain or on the shop's own domain, with a menu, cart, scheduled pickup times, loyalty and card payment. Customers order ahead; the shop sees the order on a staff dashboard, and the customer gets WhatsApp updates as it moves.

Every shop lives in its own PostgreSQL schema, so tenants never share rows. Owners run everything from a portal: menu, branding, locations, staff roles, revenue reporting and their own subscription. Two billing models are on offer, a flat monthly fee or a 2% commission on orders, and the platform bills itself through Paystack.

The unglamorous parts are where most of the engineering went: routing checkout to Yoco, PayFast, Stripe or iKhokha depending on the shop's country; provisioning a virtual host and a TLS certificate automatically when an owner points a custom domain at the platform; and parsing free-text WhatsApp orders with a language model so a shop can take orders without the customer ever opening a browser.
