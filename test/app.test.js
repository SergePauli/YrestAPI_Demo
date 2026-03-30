const test = require("node:test");
const assert = require("node:assert/strict");

const {
  canRenderChildrenAsTable,
  createApp,
  buildStatRequest,
  documents,
  flattenNodes,
  renderNode,
} = require("../app.js");

class FakeClassList {
  constructor() {
    this.set = new Set();
  }

  toggle(name, force) {
    if (force === undefined) {
      if (this.set.has(name)) {
        this.set.delete(name);
        return false;
      }
      this.set.add(name);
      return true;
    }

    if (force) {
      this.set.add(name);
      return true;
    }

    this.set.delete(name);
    return false;
  }

  contains(name) {
    return this.set.has(name);
  }
}

class FakeButton {
  constructor(id) {
    this.dataset = { id };
    this.listeners = new Map();
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  click() {
    const handler = this.listeners.get("click");
    if (handler) handler();
  }
}

class FakeElement {
  constructor(name = "") {
    this.name = name;
    this._innerHTML = "";
    this.textContent = "";
    this.value = "";
    this.scrollTop = 0;
    this.classList = new FakeClassList();
    this.listeners = new Map();
    this.buttonCache = null;
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(value) {
    this._innerHTML = value;
    this.buttonCache = null;
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  dispatch(type, payload) {
    const handler = this.listeners.get(type);
    if (handler) handler(payload);
  }

  querySelectorAll(selector) {
    if (selector !== "[data-id]") return [];
    if (!this.buttonCache) {
      const matches = [...this.innerHTML.matchAll(/data-id="(\d+)"/g)];
      this.buttonCache = matches.map((match) => new FakeButton(match[1]));
    }
    return this.buttonCache;
  }
}

class FakeDocument {
  constructor() {
    this.byId = {
      "page-shell": new FakeElement("page-shell"),
      "hero-stats": new FakeElement("hero-stats"),
      "document-count": new FakeElement("document-count"),
      "type-filter": new FakeElement("type-filter"),
      "search-input": new FakeElement("search-input"),
      "document-list": new FakeElement("document-list"),
      "document-details": new FakeElement("document-details"),
    };
    this.detailsPanel = new FakeElement("details-panel");
  }

  getElementById(id) {
    return this.byId[id] ?? null;
  }

  querySelector(selector) {
    if (selector === ".details") return this.detailsPanel;
    return null;
  }
}

class FakeWindow {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  dispatch(type, payload) {
    const handler = this.listeners.get(type);
    if (handler) handler(payload);
  }
}

function setupApp({ fetchImpl = null } = {}) {
  const doc = new FakeDocument();
  const win = new FakeWindow();
  const app = createApp({ doc, win, fetchImpl }).init();
  return { app, doc, win };
}

test("init renders registry, stats, details, and wires handlers", () => {
  const { app, doc, win } = setupApp();

  assert.match(doc.byId["hero-stats"].innerHTML, /Documents/);
  assert.match(doc.byId["type-filter"].innerHTML, /All document types/);
  assert.equal(doc.byId["document-count"].textContent, "4 items");
  assert.match(doc.byId["document-list"].innerHTML, /data-id="1001"/);
  assert.match(doc.byId["document-list"].innerHTML, /<span class="doc-type-pill">INV<\/span>/);
  assert.match(doc.byId["document-details"].innerHTML, /Document structure/);

  assert.ok(doc.byId["search-input"].listeners.has("input"));
  assert.ok(doc.byId["type-filter"].listeners.has("change"));
  assert.ok(doc.byId["document-list"].listeners.has("scroll"));
  assert.ok(doc.detailsPanel.listeners.has("scroll"));
  assert.ok(win.listeners.has("mousemove"));

  assert.equal(app.state.selectedDocumentId, 1001);
  assert.match(doc.byId["hero-stats"].innerHTML, /Average amount/);
});

test("search and type filter update rendered registry", () => {
  const { doc } = setupApp();

  doc.byId["search-input"].dispatch("input", { target: { value: "northern bank" } });
  assert.equal(doc.byId["document-count"].textContent, "1 items");
  assert.match(doc.byId["document-list"].innerHTML, /PO-240320-88/);

  doc.byId["type-filter"].dispatch("change", { target: { value: "receipt" } });
  assert.equal(doc.byId["document-count"].textContent, "0 items");
  assert.match(doc.byId["document-list"].innerHTML, /No documents found/);
});

test("clicking a document resets details scroll and renders selected details from top", () => {
  const { app, doc } = setupApp();

  doc.detailsPanel.scrollTop = 240;
  app.render();

  const buttons = doc.byId["document-list"].querySelectorAll("[data-id]");
  const paymentOrderButton = buttons.find((button) => button.dataset.id === "1003");
  paymentOrderButton.click();

  assert.equal(app.state.selectedDocumentId, 1003);
  assert.equal(doc.detailsPanel.scrollTop, 0);
  assert.match(doc.byId["document-details"].innerHTML, /PO-240320-88/);
  assert.match(doc.byId["document-details"].innerHTML, /Northern Bank JSC/);
});

test("repeated leaf children are rendered as a table by default", () => {
  const lineItemsNode = documents[0].nodes[1];

  assert.equal(canRenderChildrenAsTable(lineItemsNode), true);
  assert.match(renderNode({ ...lineItemsNode, path: "2" }), /<table class="node-table">/);
  assert.match(renderNode({ ...lineItemsNode, path: "2" }), /<th>Item<\/th>/);
  assert.doesNotMatch(renderNode({ ...lineItemsNode, path: "2" }), /node-children/);
});

test("scrolling down collapses hero and top-edge mouse reveal keeps it visible until next scroll", () => {
  const { app, doc, win } = setupApp();

  doc.byId["document-list"].scrollTop = 40;
  app.handlePaneScroll("registry");

  assert.equal(app.state.heroPinnedCollapsed, true);
  assert.equal(app.state.heroForcedVisible, false);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-collapsed"), true);

  win.dispatch("mousemove", { clientY: 10 });
  assert.equal(app.state.heroForcedVisible, true);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-peek"), true);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-collapsed"), false);

  win.dispatch("mousemove", { clientY: 80 });
  assert.equal(doc.byId["page-shell"].classList.contains("hero-peek"), true);

  doc.detailsPanel.scrollTop = 60;
  app.handlePaneScroll("details");
  assert.equal(app.state.heroForcedVisible, false);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-collapsed"), true);
});

test("flattenNodes preserves full node count and hierarchical paths", () => {
  const nodes = flattenNodes(documents[0].nodes);

  assert.equal(nodes.length, 5);
  assert.deepEqual(
    nodes.map((node) => node.path),
    ["1", "2", "2.1", "2.2", "3"]
  );
});

test("hero stats request uses /api/stat and current type filter", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    return {
      ok: true,
      async json() {
        return {
          count: 250,
          aggregates: {
            total_amount: 1234567.89,
            avg_amount: 4938.27,
            min_date: "2026-01-01",
            max_date: "2026-03-30",
          },
        };
      },
    };
  };

  const { app, doc } = setupApp({ fetchImpl });

  await app.loadHeroStats();
  assert.equal(requests[0].url, "/api/stat");
  assert.deepEqual(JSON.parse(requests[0].options.body), buildStatRequest(app));
  assert.match(doc.byId["hero-stats"].innerHTML, /1 234 567,89/);

  doc.byId["type-filter"].dispatch("change", { target: { value: "invoice" } });
  await app.loadHeroStats();

  const payload = JSON.parse(requests[requests.length - 1].options.body);
  assert.equal(payload.filters["doc_type.code__eq"], "INV");
});

test("hero stats fall back to local values when /api/stat fails", async () => {
  const fetchImpl = async () => {
    throw new Error("network down");
  };

  const { app, doc } = setupApp({ fetchImpl });
  await app.loadHeroStats();

  assert.match(doc.byId["hero-stats"].innerHTML, /Documents/);
  assert.match(doc.byId["hero-stats"].innerHTML, /Average amount/);
  assert.match(doc.byId["hero-stats"].innerHTML, /Date range/);
  assert.match(doc.byId["hero-stats"].innerHTML, /375 300,00/);
});
