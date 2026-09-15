---
title: "93 Degrees"
tagline: "One multi-tenant platform for coffee businesses, with POS, ordering, inventory, payroll and operations as modules."
description: "93 Degrees consolidates point of sale, click and collect, e-commerce, inventory, payroll and operations into one multi-tenant Django platform with runtime entitlements and a module marketplace."
sheet: "P-06"
weight: 6
status: build
rev: "A"
customer: "Coffee businesses from a single shop to a multi-site group"
stackShort: [Django, PostgreSQL, django-ninja]
stack:
  - [Framework, "Django 5.2 with django-tenants; one PostgreSQL schema per workspace, each on its own subdomain"]
  - [Database, "PostgreSQL"]
  - [APIs, "django-ninja: a Platform API and a per-workspace Workspace API with session or X-API-Key auth"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS compiled with the standalone CLI; no Node in the build"]
  - [Entitlements, "Runtime entitlement engine deciding what each workspace can reach from a catalogue of applications"]
  - [Billing, "Monthly billing run against the entitlement catalogue"]
integrations: ["Module marketplace", "CMS e-commerce module", "Operations telemetry module"]
features:
  - "Application catalogue: POS, Click & Collect, E-commerce, Inventory, Payroll and Operations as modules."
  - "All code always deployed; what a workspace can use is decided at runtime by entitlements, so plans and limits are configuration."
  - "Schema-per-tenant workspaces, each on its own subdomain, with self-serve signup and provisioning."
  - "Platform API and Workspace API, authenticated by session or API key."
  - "Monthly billing run and a marketplace for optional modules."
  - "CMS-driven public e-commerce site with a merchant workspace."
  - "South African payroll tax-year seed data included."
diagram:
  nodes:
    - { id: ws, label: "Workspace subdomain", col: 0, kind: user }
    - { id: api, label: "Platform + Workspace APIs", col: 0, kind: ext }
    - { id: ent, label: "Entitlement engine", col: 1, accent: true, note: "runtime" }
    - { id: pos, label: "POS", col: 2 }
    - { id: cc, label: "Click & Collect", col: 2 }
    - { id: ecom, label: "E-commerce", col: 2 }
    - { id: inv, label: "Inventory", col: 2 }
    - { id: pay, label: "Payroll", col: 2 }
    - { id: ops, label: "Operations", col: 2 }
    - { id: db, label: "PostgreSQL schema per workspace", col: 3, kind: store }
    - { id: bill, label: "Monthly billing run", col: 3, kind: out }
  edges:
    - [ws, ent]
    - [api, ent, "key"]
    - [ent, pos]
    - [ent, cc]
    - [ent, ecom]
    - [ent, inv]
    - [ent, pay]
    - [ent, ops]
    - [pos, db]
    - [inv, db]
    - [ops, db]
    - [ent, bill, "entitlements"]
---

After building a point of sale, an ordering platform, an e-commerce site, a payroll engine and an operations portal as separate products, the obvious next move was one platform. 93 Degrees is that consolidation: point of sale, click and collect, e-commerce, inventory, payroll and operations as catalogue applications on a single multi-tenant Django platform.

All code is always deployed. What a given workspace can reach is decided at runtime by an entitlement engine, so plans, limits and add-on modules are configuration rather than deployments. Each workspace lives on its own subdomain with schema-level isolation, a marketplace exposes optional modules, and a monthly billing run reads the same entitlement catalogue.

It is in active build, and it is the platform the rest of our coffee products are converging on. The name is the water temperature.
