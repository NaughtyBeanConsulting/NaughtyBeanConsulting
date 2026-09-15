---
title: "NaughtyScrape"
tagline: "A lead-generation CRM that scrapes Google Maps and enriches from the web."
description: "NaughtyScrape is an internal CRM with one isolated pipeline per product, filled by Google Places scraping, website enrichment for e-mails and socials, CSV import, and a normal sales pipeline with tasks and export."
sheet: "P-10"
weight: 10
status: internal
rev: "B"
customer: "Our own sales pipeline"
stackShort: [Django, PostgreSQL, "Google Places"]
stack:
  - [Framework, "Django 6, Python 3.14"]
  - [Database, "PostgreSQL via psycopg 3"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS"]
  - [Scraping, "Google Places API (New) text search, background jobs with a live progress log"]
  - [Enrichment, "Fetches each business website to extract e-mail addresses and social links"]
  - [Auth, "E-mail and password with Admin and Viewer roles"]
integrations: ["Google Places API", "CSV import/export"]
features:
  - "One workspace per product being sold; leads never bleed between pipelines."
  - "Google Maps scraping by search phrase and area, deduplicated by Place ID."
  - "Automatic expansion of searches past Google's sixty-result cap."
  - "Website enrichment for e-mail addresses and social links, because Google never returns e-mail."
  - "Manual add and CSV import with a duplicate preview."
  - "Pipeline statuses, a timeline of calls, e-mails and notes, follow-up tasks, ownership, tags and filters."
  - "CSV export for mail-merge or hand-off."
diagram:
  nodes:
    - { id: places, label: "Google Places API", col: 0, kind: ext }
    - { id: csv, label: "CSV import", col: 0, kind: out }
    - { id: jobs, label: "Scrape jobs", col: 1, note: "live progress" }
    - { id: enrich, label: "Website enrichment", col: 1 }
    - { id: app, label: "NaughtyScrape (Django)", col: 2, accent: true }
    - { id: db, label: "Leads per workspace", col: 3, kind: store }
    - { id: out, label: "CSV export", col: 3, kind: out }
  edges:
    - [places, jobs, "search"]
    - [csv, app]
    - [jobs, enrich, "websites"]
    - [enrich, app]
    - [jobs, app]
    - [app, db]
    - [app, out]
---

Selling software to coffee shops means finding coffee shops. NaughtyScrape is our lead-generation CRM: each workspace is an isolated pipeline for one product, filled by manual entry, CSV import, or scraping Google Maps through the Places API. Scraped leads are enriched by visiting the business's website to pull e-mail addresses and social links, because Google never returns e-mail.

From there it is a normal pipeline: statuses, a timeline of calls, e-mails and notes, follow-up tasks, ownership, tags, filters and CSV export. Background jobs stream a live progress log and automatically expand searches past Google's sixty-result cap, deduplicated by Place ID.

It is an internal tool and is not hardened for public use. It is on the register as an example of the small, sharp data tools we build in a few weeks.
