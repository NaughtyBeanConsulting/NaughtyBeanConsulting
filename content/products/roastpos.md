---
title: "RoastPOS"
tagline: "A tablet-first point of sale that knows what every drink actually costs."
description: "RoastPOS is a tablet-first POS for coffee shops with ingredient-level bill-of-materials costing, modifiers that change the recipe, stock takes, till control and Xero export."
sheet: "P-02"
weight: 2
status: live
rev: "D"
link: "https://roastpos.naughtybean.consulting"
linkLabel: "roastpos.naughtybean.consulting"
customer: "Independent coffee shops, pastry counters, small hospitality venues"
licence: "MIT"
mark: "img/roastpos.webp"
stackShort: [Django, PostgreSQL, PWA]
stack:
  - [Framework, "Django 5"]
  - [Database, "PostgreSQL"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS; installable PWA terminal with a service worker"]
  - [Auth, "E-mail-first custom user model with owner, admin, manager, cashier and stocktaker roles"]
  - [Exports, "CSV sales reports, Xero sales-invoice CSV with SARS-compliant VAT lines"]
  - [Hosting, "WhiteNoise static files, Sentry monitoring"]
integrations: [Xero, "SARS VAT", "E-mail low-stock alerts", "Receipt printing"]
features:
  - "Tablet POS terminal with live stock badges, installable as a PWA."
  - "Bill-of-materials costing: menu items built from ingredient recipes, prices derived from real cost plus markup."
  - "Modifier groups with per-option recipe overrides, so oat milk changes the cost as well as the price."
  - "Inventory: receiving, movement ledger, low-stock e-mail alerts and guided stock takes."
  - "Till sessions and cash-up with variance reporting."
  - "PIN-controlled voids and discounts with an audit log."
  - "Sales reporting, CSV export and a Xero sales-invoice export that ties out to the cent."
  - "Multi-location organisations with role-based team access and self-serve signup."
diagram:
  nodes:
    - { id: till, label: "Cashier tablet", col: 0, kind: user, note: "PWA terminal" }
    - { id: mgr, label: "Manager portal", col: 0, kind: user }
    - { id: app, label: "RoastPOS (Django)", col: 1, accent: true }
    - { id: bom, label: "Recipes & stock ledger", col: 1, kind: store }
    - { id: db, label: "PostgreSQL", col: 2, kind: store }
    - { id: xero, label: "Xero sales invoices", col: 2, kind: out }
    - { id: mail, label: "Low-stock alerts", col: 2, kind: ext }
    - { id: print, label: "Receipt printer", col: 2, kind: ext }
  edges:
    - [till, app, "sale"]
    - [mgr, app]
    - [app, bom, "deduct"]
    - [app, db]
    - [app, xero, "export"]
    - [app, mail]
    - [app, print]
---

Most café point-of-sale systems know what you sold. RoastPOS knows what it cost. Menu items are built from their actual ingredient recipes, so selling a flat white deducts milk, beans and a cup from stock, and the suggested selling price comes from real cost plus your markup. Modifiers change the recipe, not just the price: oat milk swaps the ingredient and the cost moves with it.

The terminal is a tablet-first web app with live stock badges, PIN-controlled voids and discounts, till sessions with cash-up and variance, and receipt printing. The management portal handles receiving, stock movements, guided stock takes, low-stock alerts, multi-location organisations and role-based access from owner down to stocktaker.

Sales export for finance with SARS-compliant VAT lines and a Xero sales-invoice CSV that ties out to the cent. We run it behind our own counter, which is where the stock-take flow was designed, on paper, before it was ever a screen.
