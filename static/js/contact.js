/* Naughty Bean Consulting — RFQ form.
   Posts JSON to the configured endpoint (FormSubmit AJAX by default). If that
   fails for any reason, falls back to a pre-filled mailto: so no brief is lost. */
(function () {
  "use strict";

  var form = document.getElementById("rfq");
  var msg = document.getElementById("form-msg");
  if (!form || !msg) return;

  var endpoint = form.getAttribute("data-endpoint") || "";
  var mailto = form.getAttribute("data-mailto") || "";
  var submitBtn = form.querySelector("[data-submit]");

  // Pre-fill from ?re=Product on product sheets
  try {
    var re = new URLSearchParams(window.location.search).get("re");
    if (re) {
      var brief = form.querySelector("#f-brief");
      if (brief && !brief.value) brief.value = "Re: " + re + "\n\n";
    }
  } catch (e) {}

  function collect() {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (v, k) {
      if (k === "build") { (data.build = data.build || []).push(v); return; }
      data[k] = v;
    });
    data.build = (data.build || []).join(", ") || "Not specified";
    return data;
  }

  function plainText(d) {
    return [
      "Name: " + (d.name || ""),
      "E-mail: " + (d.email || ""),
      "Company: " + (d.company || ""),
      "Phone: " + (d.phone || ""),
      "Building: " + d.build,
      "Budget: " + (d.budget || ""),
      "Timeline: " + (d.timeline || ""),
      "",
      "Brief:",
      d.brief || ""
    ].join("\n");
  }

  function show(kind, html) {
    msg.className = "form-msg" + (kind === "ok" ? " form-msg--ok" : "");
    msg.innerHTML = html;
    msg.removeAttribute("hidden");
    msg.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function fallback(d, reason) {
    var subject = "Build request from " + (d.name || "the website");
    var body = plainText(d);
    var href = "mailto:" + mailto + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    show("warn",
      "<strong>We could not send that automatically" + (reason ? " (" + escapeHtml(reason) + ")" : "") + ".</strong> " +
      "Nothing is lost: open it in your mail app, or copy the text below and send it to " +
      "<a href=\"mailto:" + escapeHtml(mailto) + "\">" + escapeHtml(mailto) + "</a>." +
      "<div class=\"form-msg__actions\"><a class=\"btn btn--red\" href=\"" + href + "\">Open in mail app</a>" +
      "<button type=\"button\" class=\"btn\" data-copy>Copy the brief</button></div>" +
      "<pre data-copy-src>" + escapeHtml(body) + "</pre>");
    var copyBtn = msg.querySelector("[data-copy]");
    if (copyBtn && navigator.clipboard) {
      copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(body).then(function () { copyBtn.textContent = "Copied"; });
      });
    }
  }

  function validate() {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (el) {
      var bad = !el.value.trim() || (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value));
      el.style.borderBottomColor = bad ? "var(--red)" : "";
      if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      show("warn", "<strong>A required field is missing.</strong> Name, e-mail and the brief are the minimum we need.");
      return;
    }
    var d = collect();
    if (d._honey) { show("ok", "<strong>Received.</strong>"); return; } // bot
    if (!endpoint) { fallback(d, "no delivery endpoint configured"); return; }

    var payload = {
      name: d.name, email: d.email, company: d.company, phone: d.phone,
      building: d.build, budget: d.budget, timeline: d.timeline, brief: d.brief,
      _subject: "RFQ from " + d.name + (d.company ? " (" + d.company + ")" : ""),
      _replyto: d.email,
      _template: "table",
      _captcha: "false",
      _honey: ""
    };

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, body: j }; }, function () { return { ok: r.ok, body: {} }; });
    }).then(function (res) {
      var success = res.ok && (res.body.success === true || res.body.success === "true");
      if (success) {
        show("ok", "<strong>RFQ received.</strong> Thanks, " + escapeHtml(d.name.split(" ")[0]) + ". We will reply to " + escapeHtml(d.email) + " with questions, a scope, or a straight answer on fit.");
        form.reset();
      } else {
        fallback(d, res.body && res.body.message ? res.body.message : "delivery service declined the request");
      }
    }).catch(function () {
      fallback(d, "network error");
    }).finally(function () {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send the RFQ"; }
    });
  });
})();
