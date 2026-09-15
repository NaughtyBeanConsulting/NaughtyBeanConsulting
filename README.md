# Naughty Bean Consulting

Marketing site for [naughtybean.consulting](https://naughtybean.consulting): a South African software engineering studio and the register of products it has built.

Built with [Hugo](https://gohugo.io/) and deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Design

The site is styled as a set of engineering drawing sheets. Every page is a "sheet" with a sheet number, a status stamp, dimension lines, and a title block for a footer. Two colour schemes: **Paper** (light) and **Blueprint** (dark), toggled in the header and remembered in local storage. Append `?theme=blueprint` or `?theme=paper` to any URL to force one.

There are no component libraries, no build step for CSS or JS, and no tracking. Fonts (Archivo, IBM Plex Mono) load from Google Fonts.

## Structure

```
hugo.toml                 site config, menu, contact-form endpoint
content/
  _index.md               home (sheet 00)
  products/_index.md      drawing register (sheet 01)
  products/*.md           one product sheet each (P-01 … P-11)
  services.md             scope of works (sheet 02)
  about.md                general arrangement (sheet 03)
  contact.md              RFQ form (sheet 04)
  privacy.md, terms.md    appendices A-01, A-02
layouts/
  baseof.html             frame, header, title block
  home.html               home page
  products/section.html   register table
  products/page.html      product sheet: description, diagram, notes, BOM
  services.html, about.html, contact.html
  _partials/              head, header, title-block, stamp, section-head, diagram, product-row, rfq-band
static/
  css/site.css            the whole design system
  js/site.js              theme toggle, mobile nav, dimension lines, stamps
  js/diagram.js           renders system diagrams from front matter JSON
  js/contact.js           RFQ form submission with mailto fallback
  img/                    favicons, og.png, product marks (webp)
  CNAME                   custom domain
```

## Adding a product sheet

Create `content/products/<slug>.md`. The front matter drives the whole page:

```yaml
title: "Product name"
tagline: "One line, shown under the title and in the register."
description: "Meta description."
sheet: "P-12"          # sheet number shown everywhere
weight: 12             # order in the register
status: live           # live | build | oss | client | internal
rev: "A"
link: "https://…"      # optional public URL
linkLabel: "domain.tld"
repo: "https://github.com/…"   # optional
licence: "MIT"                  # optional
customer: "Who it is for"
mark: "img/<slug>.webp"         # optional logo, shown greyscale until hovered
stackShort: [Django, PostgreSQL]
stack:                          # bill of materials
  - [Framework, "Django 5.2"]
integrations: [Yoco, PayFast]
features:                       # numbered notes
  - "Does a thing."
diagram:                        # rendered by js/diagram.js
  nodes:
    - { id: user, label: "User", col: 0, kind: user }
    - { id: app,  label: "App (Django)", col: 1, accent: true }
    - { id: db,   label: "PostgreSQL", col: 2, kind: store }
  edges:
    - [user, app, "https"]
    - [app, db]
```

Node `kind` is one of `user` (pill), `app` (default box), `store` (database), `ext` (dashed, external system) or `out` (document/output). `accent: true` draws the node in red. Edges are `[from, to, label?]` or `{from, to, label, both, soft}`.

The body of the markdown file is the description.

## Contact form

The RFQ form posts JSON to the endpoint in `hugo.toml` (`params.formEndpoint`). It defaults to [FormSubmit](https://formsubmit.co/) addressed to `hello@naughtybean.consulting`, which requires **a one-time activation**: the first real submission triggers an activation e-mail to that inbox, and nothing is delivered until the link in it is clicked. Until then, and whenever delivery fails for any reason, the form falls back to a pre-filled `mailto:` link plus a copyable text block, so no brief is lost.

To use Web3Forms or Formspree instead, change `formEndpoint` and adjust the payload keys in `static/js/contact.js` (the underscore fields are FormSubmit-specific).

## Local development

```
hugo server
```

Then open <http://localhost:1313/>. Hugo 0.146 or newer is required (the layouts use the current template lookup). CI pins 0.163.3.

## Deploying

The workflow in `.github/workflows/deploy.yml` builds and deploys on push to `main`. The repository's Pages source must be set to **GitHub Actions** (Settings → Pages → Build and deployment → Source), not "Deploy from a branch". The custom domain is carried by `static/CNAME`.

To switch the Pages source from the command line:

```
gh api -X PUT repos/NaughtyBeanConsulting/NaughtyBeanConsulting/pages -f build_type=workflow
```
