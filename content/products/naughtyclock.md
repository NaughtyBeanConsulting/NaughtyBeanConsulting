---
title: "NaughtyClock"
tagline: "Biometric clock-in terminal to Sage timesheets, with no cloud in between."
description: "NaughtyClock is a LAN-side gateway that pulls attendance events off a Hikvision face and fingerprint terminal over ISAPI, pairs them into daily timesheets and pushes them to Sage Accounting, with CSV fallback."
sheet: "P-11"
weight: 11
status: internal
rev: "A"
customer: "Our own shop, and any business with a Hikvision terminal and Sage"
stackShort: [Django, PostgreSQL, Hikvision]
stack:
  - [Framework, "Django 6"]
  - [Database, "PostgreSQL"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS; light and dark UI"]
  - [Device, "Hikvision DS-K1T343MFWX over ISAPI with digest auth, polled on the LAN"]
  - [Accounting, "Sage Accounting (ZA) push queue with stub, live and CSV modes"]
  - [Deployment, "systemd units for web, poller and nightly push; nginx; DuckDNS with a source-restricted port forward"]
integrations: ["Hikvision ISAPI", "Hik-Connect Team", "Sage Accounting ZA"]
features:
  - "Attendance events pulled straight from the terminal on the LAN; no vendor cloud dependency."
  - "Employees mirrored automatically from Hik-Connect Team; the only admin task is mapping each one to a Sage code."
  - "Positional in/out pairing into daily timesheets; days with an odd number of clocks are flagged open and held back."
  - "Sage push queue with CSV export until API credentials exist."
  - "Device poller and nightly push as background services, plus sync-now from the dashboard."
diagram:
  nodes:
    - { id: term, label: "Hikvision terminal", col: 0, kind: ext, note: "face · fingerprint" }
    - { id: hik, label: "Hik-Connect Team", col: 0, kind: ext }
    - { id: poll, label: "Poller (ISAPI)", col: 1, note: "LAN" }
    - { id: app, label: "NaughtyClock (Django)", col: 2, accent: true }
    - { id: db, label: "PostgreSQL", col: 2, kind: store }
    - { id: pair, label: "Day pairing", col: 3 }
    - { id: sage, label: "Sage Accounting ZA", col: 4, kind: ext }
    - { id: csv, label: "CSV fallback", col: 4, kind: out }
  edges:
    - [term, poll, "events"]
    - [hik, poll, "people"]
    - [poll, app]
    - [app, db]
    - [app, pair]
    - [pair, sage, "nightly push"]
    - [pair, csv]
---

A face-and-fingerprint terminal on the wall, timesheets in Sage, and nothing in between except a person retyping. NaughtyClock is the something in between. It runs on a small machine on the shop's LAN, pulls attendance events straight off a Hikvision terminal over ISAPI with no cloud dependency, pairs each person's clocks into daily timesheets, and pushes them to Sage Accounting.

Staff are managed in Hik-Connect Team and mirrored automatically; the only admin task is mapping each employee to their Sage code. Days with an odd number of clocks are flagged open and held back rather than pushed with bad data. Until Sage API credentials exist, it exports CSV instead.

It is a good example of the hardware-to-accounting plumbing we build: unglamorous, offline-tolerant, and quietly saving someone an hour a week.
