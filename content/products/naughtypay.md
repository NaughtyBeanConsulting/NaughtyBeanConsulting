---
title: "NaughtyPay"
tagline: "South African payroll: PAYE, UIF, SDL, bank files and SARS outputs."
description: "NaughtyPay is a multi-company South African payroll platform: PAYE/UIF/SDL calculation, BCEA leave, payslip PDFs, bank EFT files, EMP201 and IRP5 outputs and an employee self-service portal."
sheet: "P-05"
weight: 5
status: build
rev: "B"
link: "https://naughtypay.naughtybean.consulting"
linkLabel: "naughtypay.naughtybean.consulting"
customer: "South African SMEs, payroll administrators and bookkeepers"
stackShort: [Django, PostgreSQL, WeasyPrint]
stack:
  - [Framework, "Python 3.12, Django 5.2"]
  - [Database, "PostgreSQL"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS v4; mobile employee self-service portal"]
  - [Documents, "WeasyPrint for payslip PDFs, openpyxl for the accounting journal"]
  - [Admin, "django-unfold"]
  - [Testing, "pytest across the statutory calculation engine"]
integrations: ["FNB", "Standard Bank", "ABSA", "Nedbank", "Capitec", "SARS e@syFile", "DoL uFiling", "MIBFA", "WhatsApp"]
features:
  - "Monthly, fortnightly or weekly pay runs with a calculate, review and finalise workflow."
  - "PAYE, UIF and SDL calculated per run; SA ID validation derives date of birth and gender."
  - "BCEA leave with a public-holiday-aware working-day count and an approval workflow; approved unpaid leave flows into the next run."
  - "Payslip PDFs, an Excel accounting journal and a bank EFT file for FNB, Standard Bank, ABSA, Nedbank or Capitec."
  - "EMP201, bi-annual IRP5/IT3(a) for e@syFile, UIF declarations for uFiling and MIBFA contribution files, each with pre-filing validation."
  - "Employee self-service for payslips, leave, expense claims and detail changes, with WhatsApp notifications."
  - "Payroll summary, leave-liability and journal reports."
diagram:
  nodes:
    - { id: admin, label: "Payroll admin", col: 0, kind: user }
    - { id: emp, label: "Employee self-service", col: 0, kind: user, note: "mobile" }
    - { id: app, label: "NaughtyPay (Django)", col: 1, accent: true }
    - { id: engine, label: "PAYE · UIF · SDL engine", col: 1, kind: store }
    - { id: db, label: "PostgreSQL", col: 2, kind: store }
    - { id: slips, label: "Payslip PDFs", col: 2, kind: out }
    - { id: eft, label: "Bank EFT files", col: 2, kind: out }
    - { id: sars, label: "EMP201 · IRP5 · uFiling", col: 2, kind: out }
    - { id: wa, label: "WhatsApp notices", col: 2, kind: ext }
  edges:
    - [admin, app, "pay run"]
    - [emp, app, "leave · claims"]
    - [app, engine, "calculate"]
    - [app, db]
    - [app, slips]
    - [app, eft]
    - [app, sars]
    - [app, wa]
---

South African payroll has a lot of rules and not much software that respects them. NaughtyPay runs monthly, fortnightly or weekly pay runs for multiple companies, calculates PAYE, UIF and SDL, and produces payslip PDFs, a bank EFT file for FNB, Standard Bank, ABSA, Nedbank or Capitec, and an Excel journal for the accountant.

Leave follows the BCEA, with a public-holiday-aware working-day count, an approval workflow, and approved unpaid leave flowing into the next run. Employees get a mobile self-service portal for payslips, leave, expense claims and detail changes, with WhatsApp notifications.

Filing outputs cover the EMP201, the bi-annual IRP5/IT3(a) submission for e@syFile, the UIF declaration for uFiling and MIBFA contributions, each with pre-filing validation. The statutory outputs are being verified line by line before general release, which is why this sheet is stamped in build.
