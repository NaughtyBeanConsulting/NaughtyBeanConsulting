---
title: "AtlasHub"
tagline: "Project tracker and wiki in one self-hosted Django monolith."
description: "AtlasHub is a self-hosted Jira-and-Confluence replacement in one Django app: backlog, sprints, board, timeline and a nested wiki with Markdown, Mermaid and draw.io, with WhatsApp notifications."
sheet: "P-09"
weight: 9
status: internal
rev: "B"
link: "https://atlashub.naughtybean.consulting/"
linkLabel: "atlashub.naughtybean.consulting"
customer: "Our own delivery team"
stackShort: [Django, PostgreSQL, HTMX]
stack:
  - [Framework, "Django 6, Python 3.12+"]
  - [Database, "PostgreSQL via psycopg 3"]
  - [Front end, "Server-rendered templates, HTMX, Alpine.js, Tailwind CSS compiled with the standalone CLI"]
  - [Admin, "django-unfold"]
  - [Notifications, "WhatsApp through a shared whatsapp-web.js sidecar with token-authenticated local HTTP; e-mail fallback"]
integrations: [WhatsApp, Mermaid, "draw.io", Markdown]
features:
  - "Issue hierarchy with space keys: epics, stories, tasks, bugs and sub-tasks."
  - "Backlog with drag-to-sprint; sprint start and complete with rollover of unfinished work."
  - "Drag-and-drop board and a timeline of epics across sprints."
  - "Nested wiki pages with Markdown, Mermaid diagrams, embedded draw.io and version history."
  - "Comments with @mentions."
  - "WhatsApp notifications for assignments, mentions, sprint events and password resets, with an ops dashboard for QR pairing."
diagram:
  nodes:
    - { id: team, label: "Team", col: 0, kind: user }
    - { id: work, label: "Backlog · Sprints · Board · Timeline", col: 1 }
    - { id: wiki, label: "Wiki: Markdown · Mermaid · draw.io", col: 1 }
    - { id: app, label: "AtlasHub (Django)", col: 2, accent: true }
    - { id: db, label: "PostgreSQL", col: 3, kind: store }
    - { id: wa, label: "WhatsApp sidecar", col: 3, kind: ext }
  edges:
    - [team, work]
    - [team, wiki]
    - [work, app]
    - [wiki, app]
    - [app, db]
    - [app, wa, "notify"]
---

We wanted Jira and Confluence without the licence, the latency or the two logins. AtlasHub is both in one self-hosted Django monolith: Scrum spaces with a backlog, sprints, a drag-and-drop board and a timeline, next to a nested wiki with Markdown, Mermaid and embedded draw.io diagrams. Same login, same navigation, same design language.

Notifications go out over WhatsApp with e-mail fallback: assignments, mentions, sprint events, even password resets. It runs our own delivery, including the products on this register. It is on the register because it is exactly the kind of internal tool we can build for a business that has outgrown the spreadsheet.
