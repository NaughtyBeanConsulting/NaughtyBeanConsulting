---
title: "Scutiva OSS"
tagline: "Self-hosted, agentless security posture and SBOM for Linux fleets."
description: "Scutiva is an open-source, self-hosted security operations portal: SSH onboarding with fingerprint pinning, Lynis posture checks, Syft SBOMs, Grype CVE correlation and Trivy filesystem scans. Nothing leaves your network."
sheet: "P-08"
weight: 8
status: oss
rev: "C"
link: "https://naughtybeanconsulting.github.io/ScutivaLandingPages/"
linkLabel: "Scutiva site"
repo: "https://github.com/NaughtyBeanConsulting/Scutiva"
repoLabel: "NaughtyBeanConsulting/Scutiva"
licence: "MIT"
customer: "Security, DevOps and IT teams running Linux hosts"
mark: "img/scutiva.webp"
stackShort: [Django, PostgreSQL, SSH]
stack:
  - [Framework, "Django with split settings"]
  - [Database, "PostgreSQL for storage and for the worker queue, using FOR UPDATE SKIP LOCKED"]
  - [Remote access, "Paramiko over SSH with pinned host fingerprints; no agent on the host"]
  - [Scanners, "Lynis (posture), Syft (SBOM), Grype (CVE correlation), Trivy (filesystem, secrets, misconfigurations, licences)"]
  - [Front end, "HTMX, Alpine.js, Tailwind CSS"]
  - [Hosting, "Self-hosted only; there is no Scutiva cloud"]
integrations: [Lynis, Syft, Grype, Trivy, SSH]
features:
  - "Agentless onboarding: add a host with SSH credentials and pin its fingerprint."
  - "Remote toolchain installer puts the scanners on the box for you."
  - "Application-root discovery, SBOM generation and CVE correlation."
  - "Linux posture and hardening audit."
  - "Filesystem scans for vulnerabilities, misconfigurations, secrets and licence signals."
  - "PostgreSQL-backed scheduler and worker queue, no extra infrastructure."
  - "Findings workflow, dashboards and generated reports."
diagram:
  nodes:
    - { id: op, label: "Operator portal", col: 0, kind: user }
    - { id: app, label: "Scutiva (Django)", col: 1, accent: true }
    - { id: q, label: "PostgreSQL queue + findings", col: 1, kind: store }
    - { id: worker, label: "Worker", col: 2 }
    - { id: host, label: "Linux hosts", col: 3, kind: ext, note: "SSH · fingerprint pinned" }
    - { id: tools, label: "Lynis · Syft · Grype · Trivy", col: 3, kind: ext }
    - { id: rep, label: "Reports", col: 2, kind: out }
  edges:
    - [op, app]
    - [app, q, "schedule"]
    - [q, worker, "SKIP LOCKED"]
    - [worker, host, "ssh"]
    - [host, tools, "runs"]
    - [app, rep]
---

Scutiva is an open-source, self-hosted security operations portal for Linux hosts. You add a server with SSH credentials, pin its host fingerprint, and Scutiva installs its toolchain remotely. No agent to deploy or maintain, no hosted control plane, nothing leaves your infrastructure.

From there it runs Lynis posture checks, generates a software bill of materials with Syft, correlates package vulnerabilities with Grype, and scans filesystems with Trivy for vulnerabilities, misconfigurations, secrets and licence signals. Findings land in a live operator workflow with dashboards and generated reports.

It is deliberately not an external attack-surface scanner. Its pitch is authenticated evidence about what is actually installed, which is the question most vulnerability tools answer by guessing from the outside. MIT licensed; pull requests welcome.
