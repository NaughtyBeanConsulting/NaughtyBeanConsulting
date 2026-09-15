---
title: "CremaIQ"
tagline: "Coffee operations in one portal: machine tickets, SOPs, shifts and telemetry."
description: "CremaIQ is a multi-tenant coffee-operations platform: machine support tickets, SOP checklists with photo evidence, shifts, espresso-machine and water telemetry, and WhatsApp automation with AI triage."
sheet: "P-04"
weight: 4
status: build
rev: "B"
link: "https://cremaiq.com"
linkLabel: "cremaiq.com"
customer: "Coffee-shop owners, baristas and machine service teams"
mark: "img/cremaiq.webp"
stackShort: [Django, PostgreSQL, Procrastinate]
stack:
  - [Framework, "Django 6 with django-tenants, one PostgreSQL schema per organisation"]
  - [Database, "PostgreSQL"]
  - [Jobs, "Procrastinate, a PostgreSQL-backed task queue; no Redis, no Celery"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS; installable barista PWA"]
  - [Admin, "django-unfold"]
  - [Auth, "E-mail-only custom user, Google sign-in via django-allauth, Cloudflare Turnstile"]
  - [Hosting, "Gunicorn"]
integrations: ["Twilio WhatsApp Business API", "Flow Coffee API", "WaterTDS / TDSBot API", OpenRouter, "Resend (Anymail)"]
features:
  - "Multi-tenant organisations with roles and invitations."
  - "Machine support ticketing with a Kanban board, SLA-style workflow and a cross-tenant operations console for service teams."
  - "SOP templates and runs for opening, closing and cleaning, with photo evidence."
  - "Shifts, clock in and out, and a missed-clock workflow."
  - "Espresso-machine shot telemetry synced from Flow Coffee, with e-mailed performance reports."
  - "Water-quality dashboard fed by WaterTDS sensors."
  - "WhatsApp reminders and broadcasts, and an AI agent that turns inbound messages into tickets."
  - "Weekly Monday operational report and an immutable audit log."
diagram:
  nodes:
    - { id: barista, label: "Barista app", col: 0, kind: user, note: "PWA" }
    - { id: mgr, label: "Manager portal", col: 0, kind: user }
    - { id: wa, label: "WhatsApp inbound", col: 0, kind: ext }
    - { id: app, label: "CremaIQ (Django)", col: 1, accent: true, note: "multi-tenant" }
    - { id: jobs, label: "Procrastinate jobs", col: 1, kind: store }
    - { id: db, label: "PostgreSQL", col: 2, kind: store }
    - { id: flow, label: "Flow Coffee telemetry", col: 2, kind: ext }
    - { id: tds, label: "WaterTDS sensors", col: 2, kind: ext }
    - { id: ai, label: "OpenRouter triage", col: 2, kind: ext }
    - { id: twilio, label: "Twilio WhatsApp", col: 2, kind: ext }
  edges:
    - [barista, app]
    - [mgr, app]
    - [wa, app, "message"]
    - [app, jobs]
    - [app, db]
    - [flow, app, "sync"]
    - [tds, app, "sync"]
    - [app, ai, "triage"]
    - [app, twilio, "notify"]
---

Running coffee shops is an operations problem. Machines fail on Saturday mornings, opening checklists get skipped, shots drift, and nobody notices until a customer does. CremaIQ puts those workflows in one multi-tenant portal: machine support tickets on a Kanban board, SOP checklists for opening, closing and cleaning with photo evidence, staff shifts with clock in and out, and dashboards for machine utilisation, shot quality and water quality.

Espresso-machine telemetry syncs from Flow Coffee and water data from WaterTDS, so quality problems surface as data rather than complaints. WhatsApp automation sends reminders and broadcasts, and an AI agent turns inbound WhatsApp messages into tickets for a human to confirm. Baristas get their own installable phone app.

Background jobs run on Procrastinate, a PostgreSQL-backed queue, so there is no Redis or Celery to babysit. The platform is in active build.
