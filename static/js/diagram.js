/* Naughty Bean Consulting — system diagram renderer.
   Reads JSON from a <script type="application/json"> inside [data-diagram]
   and draws a column-based block diagram as SVG in the drawing style.

   { "nodes": [{ "id", "label", "col", "kind": "user|app|store|ext|out", "accent": true, "note": "small caption" }],
     "edges": [[from, to, label?], { "from", "to", "label", "both": true, "soft": true }] }
*/
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var NODE_W = 152, LINE_H = 13, PAD_Y = 11, COL_GAP = 100, ROW_GAP = 20, PAD = 26, MAX_CHARS = 20;

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function wrap(label) {
    var out = [];
    String(label).split("\n").forEach(function (line) {
      var words = line.split(" "), cur = "";
      words.forEach(function (w) {
        if ((cur + " " + w).trim().length > MAX_CHARS && cur) { out.push(cur); cur = w; }
        else cur = (cur + " " + w).trim();
      });
      if (cur) out.push(cur);
    });
    return out;
  }

  function normaliseEdge(e) {
    if (Array.isArray(e)) return { from: e[0], to: e[1], label: e[2] || "" };
    return e;
  }

  function render(container, data) {
    var nodes = (data.nodes || []).map(function (n) {
      var lines = wrap(n.label);
      var h = PAD_Y * 2 + lines.length * LINE_H + (n.note ? 11 : 0);
      return { id: n.id, lines: lines, col: n.col || 0, kind: n.kind || "app", accent: !!n.accent, note: n.note || "", w: NODE_W, h: Math.max(h, 40) };
    });
    var edges = (data.edges || []).map(normaliseEdge);
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    // Column layout
    var cols = [];
    nodes.forEach(function (n) { (cols[n.col] = cols[n.col] || []).push(n); });
    var colHeights = cols.map(function (c) {
      return c ? c.reduce(function (s, n) { return s + n.h; }, 0) + ROW_GAP * (c.length - 1) : 0;
    });
    var maxH = Math.max.apply(null, colHeights.concat([0]));
    var W = PAD * 2 + cols.length * NODE_W + (cols.length - 1) * COL_GAP;
    var longSpan = edges.some(function (e) { return byId[e.from] && byId[e.to] && Math.abs(byId[e.from].col - byId[e.to].col) > 1; });
    var H = PAD * 2 + maxH + (longSpan ? 22 : 0);

    cols.forEach(function (c, ci) {
      if (!c) return;
      var y = PAD + (maxH - colHeights[ci]) / 2;
      c.forEach(function (n) {
        n.x = PAD + ci * (NODE_W + COL_GAP);
        n.y = y;
        y += n.h + ROW_GAP;
      });
    });

    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "System diagram" });
    svg.style.width = "100%";
    svg.style.maxWidth = Math.round(W * 1.15) + "px";
    svg.style.minWidth = Math.round(Math.min(W, 560)) + "px";

    var defs = el("defs", {}, svg);
    ["", "--soft"].forEach(function (suffix) {
      var m = el("marker", { id: "dg-arrow" + suffix.replace("--", "-"), viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }, defs);
      el("path", { d: "M0 0 L10 5 L0 10 z", "class": "dg-arrow" + suffix }, m);
    });

    // Faint grid behind the drawing
    var g = el("g", { "class": "dg-gridlayer" }, svg);
    for (var gx = 0; gx <= W; gx += 24) el("line", { x1: gx, y1: 0, x2: gx, y2: H, "class": "dg-grid" }, g);
    for (var gy = 0; gy <= H; gy += 24) el("line", { x1: 0, y1: gy, x2: W, y2: gy, "class": "dg-grid" }, g);

    // Edges
    var eg = el("g", { "class": "dg-edges" }, svg);
    var outCount = {}, inCount = {};
    edges.forEach(function (e) {
      outCount[e.from] = (outCount[e.from] || 0) + 1;
      inCount[e.to] = (inCount[e.to] || 0) + 1;
    });
    var trunkAnchors = {};
    function slotFor(gapKey, anchorId) {
      var list = (trunkAnchors[gapKey] = trunkAnchors[gapKey] || []);
      var i = list.indexOf(anchorId);
      if (i < 0) { list.push(anchorId); i = list.length - 1; }
      return i === 0 ? 0 : (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 9;
    }
    var TRUNK = 24;
    edges.forEach(function (e) {
      var a = byId[e.from], b = byId[e.to];
      if (!a || !b) return;
      var d, lx, ly;
      if (a.col === b.col) {
        var top = a.y < b.y ? a : b, bot = a.y < b.y ? b : a;
        var x = top.x + NODE_W / 2;
        d = (a.y < b.y)
          ? "M" + x + " " + (top.y + top.h) + " V" + bot.y
          : "M" + x + " " + a.y + " V" + (b.y + b.h);
        lx = x; ly = (top.y + top.h + bot.y) / 2;
      } else {
        var forward = a.col < b.col;
        var dir = forward ? 1 : -1;
        var x1 = forward ? a.x + NODE_W : a.x;
        var x2 = forward ? b.x : b.x + NODE_W;
        var y1 = a.y + a.h / 2, y2 = b.y + b.h / 2;
        var span = Math.abs(b.col - a.col);
        var gapKey = Math.min(a.col, b.col) + ":" + Math.max(a.col, b.col);
        var midX;
        if (span > 1) {
          // Long-span edge: drop below the drawing, run across, and enter the target from below.
          midX = x1 + dir * (TRUNK + slotFor(gapKey, a.id));
          var floorY = H - 12;
          var tx = b.x + NODE_W / 2;
          d = "M" + x1 + " " + y1 + " H" + midX + " V" + floorY + " H" + tx + " V" + (b.y + b.h);
          lx = (midX + tx) / 2; ly = floorY;
        } else if (outCount[a.id] > 1) {
          // Fan-out: one trunk near the source, labels on the run into each target.
          midX = x1 + dir * (TRUNK + slotFor(gapKey, a.id));
          d = "M" + x1 + " " + y1 + " H" + midX + " V" + y2 + " H" + x2;
          lx = (midX + x2) / 2; ly = y2;
        } else if (inCount[b.id] > 1) {
          // Fan-in: one trunk near the target, labels on the run out of each source.
          midX = x2 - dir * (TRUNK + slotFor(gapKey, b.id));
          d = "M" + x1 + " " + y1 + " H" + midX + " V" + y2 + " H" + x2;
          lx = (x1 + midX) / 2; ly = y1;
        } else {
          midX = (x1 + x2) / 2;
          d = "M" + x1 + " " + y1 + " H" + midX + " V" + y2 + " H" + x2;
          if (Math.abs(y1 - y2) < 2) { lx = midX; ly = y1; } else { lx = midX; ly = (y1 + y2) / 2; }
        }
      }
      var attrs = { d: d, "class": "dg-edge" + (e.soft ? " dg-edge--soft" : ""), "marker-end": "url(#dg-arrow" + (e.soft ? "-soft" : "") + ")" };
      if (e.both) attrs["marker-start"] = "url(#dg-arrow" + (e.soft ? "-soft" : "") + ")";
      el("path", attrs, eg);
      if (e.label) {
        var lg = el("g", { "class": "dg-elabel" }, eg);
        var tw = e.label.length * 5.2 + 8;
        el("rect", { x: lx - tw / 2, y: ly - 7, width: tw, height: 14 }, lg);
        var t = el("text", { x: lx, y: ly + 3, "text-anchor": "middle" }, lg);
        t.textContent = e.label;
      }
    });

    // Nodes
    var ng = el("g", { "class": "dg-nodes" }, svg);
    nodes.forEach(function (n) {
      var cls = "dg-node dg-node--" + n.kind + (n.accent ? " dg-node--accent" : "");
      var grp = el("g", { "class": cls, transform: "translate(" + n.x + " " + n.y + ")" }, ng);
      if (n.kind === "user") {
        el("rect", { x: 0.5, y: 0.5, width: n.w - 1, height: n.h - 1, rx: n.h / 2 }, grp);
      } else if (n.kind === "store") {
        el("rect", { x: 0.5, y: 0.5, width: n.w - 1, height: n.h - 1 }, grp);
        el("path", { d: "M0.5 6.5 H" + (n.w - 0.5), "class": "dg-store-line" }, grp);
      } else if (n.kind === "out") {
        var c = 10;
        el("path", { d: "M0.5 0.5 H" + (n.w - c) + " L" + (n.w - 0.5) + " " + c + " V" + (n.h - 0.5) + " H0.5 Z" }, grp);
        el("path", { d: "M" + (n.w - c) + " 0.5 V" + c + " H" + (n.w - 0.5) }, grp);
      } else {
        el("rect", { x: 0.5, y: 0.5, width: n.w - 1, height: n.h - 1 }, grp);
      }
      var textTop = PAD_Y + LINE_H - 3 + (n.kind === "store" ? 3 : 0);
      n.lines.forEach(function (line, i) {
        var t = el("text", { x: n.w / 2, y: textTop + i * LINE_H, "text-anchor": "middle" }, grp);
        t.textContent = line;
      });
      if (n.note) {
        var nt = el("text", { x: n.w / 2, y: n.h - 6, "text-anchor": "middle", "class": "dg-kind" }, grp);
        nt.textContent = n.note;
      }
    });

    container.innerHTML = "";
    container.appendChild(svg);
  }

  document.querySelectorAll("[data-diagram]").forEach(function (box) {
    var script = box.querySelector("script[type='application/json']");
    if (!script) return;
    try {
      render(box, JSON.parse(script.textContent));
    } catch (e) {
      if (window.console) console.warn("diagram: could not render", e);
    }
  });
})();
