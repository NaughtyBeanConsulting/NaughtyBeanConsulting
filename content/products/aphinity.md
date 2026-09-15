---
title: "APhinity AI"
tagline: "AI accounts-payable intelligence for multi-site property portfolios. Client engagement."
description: "Naughty Bean Consulting is the engineering partner behind APhinity AI: a NestJS, React and FastAPI platform on a multi-account AWS estate that reads utility bills and leases and flags overcharges before they are paid."
sheet: "P-07"
weight: 7
status: client
rev: "C"
link: "https://aphinity.co"
linkLabel: "aphinity.co"
customer: "Property portfolios, finance and ESG teams"
mark: "img/aphinity.webp"
stackShort: [NestJS, React, FastAPI, AWS]
stack:
  - [API, "NestJS with TypeORM"]
  - [Portal, "React with Vite"]
  - [AI service, "FastAPI document-extraction service"]
  - [Control plane, "Django, managing tariff libraries, legal documents and tenant provisioning across accounts"]
  - [Database, "PostgreSQL on Amazon RDS"]
  - [Infrastructure, "AWS ECS and RDS defined in CDK; Control Tower landing zone with separate accounts per environment and per enterprise customer"]
  - [Delivery, "GitHub Actions with OIDC deploys and verified image promotion"]
  - [Docs and marketing, "Docusaurus help centre; Next.js marketing site with a Resend-backed enquiry route"]
integrations: [AWS, "Amazon SES", Resend, OpenRouter, "GitHub Actions"]
features:
  - "Monthly ingestion of utility bills and leases across every site in a portfolio."
  - "AI extraction of line items, validated against printed totals before anything is stored."
  - "Validation engine that checks each bill against tariffs, leases and history and raises workflow tickets for anomalies."
  - "Baseline and ESG reporting per site and per portfolio."
  - "Dedicated single-tenant AWS accounts for enterprise customers, provisioned from a control plane."
  - "External penetration-test remediation, MFA, session revocation, WAF and CI security scanning."
  - "One-page marketing site with a proof-of-value enquiry flow."
diagram:
  nodes:
    - { id: bills, label: "Bills & leases (PDF)", col: 0, kind: out }
    - { id: users, label: "Finance & ESG teams", col: 0, kind: user }
    - { id: extract, label: "AI extraction (FastAPI)", col: 1, kind: ext }
    - { id: api, label: "API (NestJS)", col: 1, accent: true }
    - { id: portal, label: "Portal (React)", col: 1 }
    - { id: db, label: "PostgreSQL (RDS)", col: 2, kind: store }
    - { id: tickets, label: "Workflow tickets", col: 2, kind: out }
    - { id: cp, label: "Control plane (Django)", col: 2, kind: ext }
  edges:
    - [bills, extract]
    - [extract, api, "validated"]
    - [users, portal]
    - [portal, api]
    - [api, db]
    - [api, tickets, "anomaly"]
    - [cp, api, "tariffs · tenants"]
---

APhinity AI reads every utility bill and lease across a property portfolio, checks each one against tariffs, contracts and history, and raises a ticket before an overcharge is paid. Naughty Bean Consulting is the engineering partner behind the platform and its marketing site.

The platform is a monorepo: a NestJS and TypeORM API, a React and Vite portal, a FastAPI service for AI document extraction, a Docusaurus help centre and AWS CDK infrastructure spanning development, QA, staging and production, plus dedicated single-tenant AWS accounts for enterprise customers. A Django control plane manages tariff libraries, legal documents and tenant provisioning across those accounts.

Client work is described here in general terms only. The parts we can talk about include a multi-account AWS landing zone built with Control Tower, an external penetration-test remediation programme taken from findings report to evidence pack, MFA and session hardening, and a validation engine that turns billing anomalies into workflow tickets a finance team can action.
