const test = require("node:test");
const assert = require("node:assert/strict");

const {
  canRenderChildrenAsTable,
  createApp,
  buildRegistryPageRequest,
  buildStatRequest,
  documents,
  flattenNodes,
  renderNode,
} = require("../app.js");
const {
  buildPresetPageRequest,
  buildPresetItemRequest,
  buildStatsRequest,
  createYrestApiClient,
} = require("../yrest-client.js");

class FakeURLSearchParams {
  constructor(query = "") {
    this.values = new Map();
    const normalized = String(query).replace(/^\?/, "");
    if (!normalized) return;

    normalized.split("&").forEach((chunk) => {
      const [key, value = ""] = chunk.split("=");
      this.values.set(decodeURIComponent(key), decodeURIComponent(value));
    });
  }

  get(key) {
    return this.values.get(key) ?? null;
  }
}

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
  constructor({ protocol = "http:", hostname = "localhost", port = "4173", search = "" } = {}) {
    this.listeners = new Map();
    this.location = { protocol, hostname, port, search };
    this.console = { warn() {} };
  }

  addEventListener(type, handler) {
    this.listeners.set(type, handler);
  }

  dispatch(type, payload) {
    const handler = this.listeners.get(type);
    if (handler) handler(payload);
  }
}

global.URLSearchParams = FakeURLSearchParams;

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
  assert.match(doc.byId["document-details"].innerHTML, /No document selected/);

  assert.ok(doc.byId["search-input"].listeners.has("input"));
  assert.ok(doc.byId["type-filter"].listeners.has("change"));
  assert.ok(doc.byId["document-list"].listeners.has("scroll"));
  assert.ok(doc.detailsPanel.listeners.has("scroll"));
  assert.ok(win.listeners.has("mousemove"));

  assert.equal(app.state.selectedDocumentId, null);
  assert.match(doc.byId["hero-stats"].innerHTML, /Documents/);
  assert.match(doc.byId["hero-stats"].innerHTML, /Date range/);
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
  assert.equal(doc.byId["page-shell"].classList.contains("hero-collapsed"), false);

  win.dispatch("mousemove", { clientY: 10 });
  assert.equal(app.state.heroForcedVisible, true);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-peek"), false);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-collapsed"), false);

  win.dispatch("mousemove", { clientY: 80 });
  assert.equal(doc.byId["page-shell"].classList.contains("hero-peek"), false);

  doc.detailsPanel.scrollTop = 60;
  app.handlePaneScroll("details");
  assert.equal(app.state.heroForcedVisible, false);
  assert.equal(doc.byId["page-shell"].classList.contains("hero-collapsed"), false);
});

test("flattenNodes preserves full node count and hierarchical paths", () => {
  const nodes = flattenNodes(documents[0].nodes);

  assert.equal(nodes.length, 5);
  assert.deepEqual(
    nodes.map((node) => node.path),
    ["1", "2", "2.1", "2.2", "3"]
  );
});

test("hero stats request uses /api/stats and current type filter", async () => {
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
  assert.equal(requests[0].url, "/api/stats");
  assert.deepEqual(JSON.parse(requests[0].options.body), buildStatRequest(app));
  assert.match(doc.byId["hero-stats"].innerHTML, /Documents/);
  assert.match(doc.byId["hero-stats"].innerHTML, /Date range/);

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
  assert.match(doc.byId["hero-stats"].innerHTML, /Date range/);
});

test("registry page request includes preset, offset, limit, and active filters", () => {
  const { app, doc } = setupApp();

  doc.byId["search-input"].dispatch("input", { target: { value: "Northern Bank" } });
  doc.byId["type-filter"].dispatch("change", { target: { value: "payment_order" } });

  assert.deepEqual(buildRegistryPageRequest(app, { preset: "list_item", offset: 40, limit: 20 }), {
    model: "Document",
    preset: "list_item",
    offset: 40,
    limit: 20,
    filters: {
      "doc_type.code__eq": "PO",
      "number_or_counterparty.name_or_counterparty.tax_id_or_summary__cnt": "Northern Bank",
    },
  });
});

test("yrest client posts preset page and stats requests to dedicated endpoints", async () => {
  const requests = [];
  const client = createYrestApiClient({
    fetchImpl: async (url, options) => {
      requests.push({ url, options });
      return {
        ok: true,
        async json() {
          return { items: [], count: 0 };
        },
      };
    },
    apiBaseUrl: "/backend",
  });

  await client.fetchPresetPage({
    model: "Document",
    preset: "list_item",
    offset: 60,
    limit: 30,
    filters: { status__eq: "Posted" },
  });
  await client.fetchStats({
    model: "Document",
    filters: { status__eq: "Posted" },
    aggregates: { total_amount: { fn: "sum", field: "amount" } },
  });
  await client.fetchPresetItem({
    model: "Document",
    preset: "detail",
    id: 1001,
  });

  assert.equal(requests[0].url, "/backend/api/index");
  assert.deepEqual(JSON.parse(requests[0].options.body), {
    model: "Document",
    preset: "list_item",
    offset: 60,
    limit: 30,
    filters: { status__eq: "Posted" },
  });

  assert.equal(requests[1].url, "/backend/api/stats");
  assert.deepEqual(JSON.parse(requests[1].options.body), {
    model: "Document",
    filters: { status__eq: "Posted" },
    aggregates: { total_amount: { fn: "sum", field: "amount" } },
  });
  assert.equal(requests[2].url, "/backend/api/index");
  assert.deepEqual(JSON.parse(requests[2].options.body), {
    model: "Document",
    preset: "detail",
    offset: 0,
    limit: 1,
    filters: { id__eq: 1001 },
  });

  assert.deepEqual(
    buildPresetPageRequest({
      model: "Document",
      preset: "list_item",
      offset: 10,
      limit: 15,
      filters: { doc_type__eq: "invoice" },
    }),
    {
      model: "Document",
      preset: "list_item",
      offset: 10,
      limit: 15,
      filters: { doc_type__eq: "invoice" },
    }
  );

  assert.deepEqual(
    buildPresetItemRequest({
      model: "Document",
      preset: "detail",
      id: 42,
    }),
    {
      model: "Document",
      preset: "detail",
      offset: 0,
      limit: 1,
      filters: { id__eq: 42 },
    }
  );

  assert.deepEqual(
    buildStatsRequest({
      model: "Document",
      filters: { doc_type__eq: "invoice" },
      aggregates: { total_amount: { fn: "sum", field: "amount" } },
    }),
    {
      model: "Document",
      filters: { doc_type__eq: "invoice" },
      aggregates: { total_amount: { fn: "sum", field: "amount" } },
    }
  );
});

test("browser app targets localhost:8080 by default when opened from local dev origins", async () => {
  const requests = [];
  const doc = new FakeDocument();
  const win = new FakeWindow({ protocol: "http:", hostname: "localhost", port: "4173" });
  const app = createApp({
    doc,
    win,
    fetchImpl: async (url) => {
      requests.push(url);
      return {
        ok: true,
        async json() {
          return {
            count: 0,
            aggregates: {
              total_amount: 0,
              avg_amount: 0,
              min_date: null,
              max_date: null,
            },
          };
        },
      };
    },
    apiBaseUrl: "http://localhost:8080",
  }).init();

  await app.loadHeroStats();
  assert.equal(requests[0], "http://localhost:8080/api/stats");
});

test("remote detail loads only when selecting a different document", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    const payload = JSON.parse(options.body);

    if (url.endsWith("/api/stats")) {
      return {
        ok: true,
        async json() {
          return {
            count: 1,
            aggregates: {
              total_amount: 124500,
              avg_amount: 124500,
              min_date: "2026-03-15",
              max_date: "2026-03-15",
            },
          };
        },
      };
    }

    if (payload.preset === "list_item") {
      return {
        ok: true,
        async json() {
          return {
            count: 1,
            items: [
              {
                id: 1001,
                number: "INV-240315-17",
                date: "2026-03-15",
                status: "Posted",
                amount: 124500,
                currency: "RUB",
                summary: "Invoice summary",
                counterparty: { name: "Orion Supply LLC", inn: "7704123456", kpp: "770401001" },
                doc_type: { id: "invoice", code: "INV", name: "Invoice", accent: "VAT" },
              },
            ],
          };
        },
      };
    }

    return {
      ok: true,
      async json() {
        return {
          items: [
            {
              id: 1001,
              number: "INV-240315-17",
              date: "2026-03-15",
              status: "Posted",
              amount: 124500,
              currency: "RUB",
              summary: "Invoice summary",
              counterparty: { name: "Orion Supply LLC", inn: "7704123456", kpp: "770401001" },
              doc_type: { id: "invoice", code: "INV", name: "Invoice", accent: "VAT" },
              nodes: [],
            },
          ],
        };
      },
    };
  };

  const doc = new FakeDocument();
  const win = new FakeWindow();
  const app = createApp({ doc, win, fetchImpl, apiBaseUrl: "/api-base" }).init();

  await new Promise((resolve) => setTimeout(resolve, 0));
  app.selectDocument(1001);
  await new Promise((resolve) => setTimeout(resolve, 0));

  const requestCountAfterFirstLoad = requests.filter(
    (request) =>
      request.url === "/api-base/api/index" &&
      JSON.parse(request.options.body).preset === "detail"
  ).length;

  app.selectDocument(1001);

  const requestCountAfterSecondSelect = requests.filter(
    (request) =>
      request.url === "/api-base/api/index" &&
      JSON.parse(request.options.body).preset === "detail"
  ).length;

  assert.equal(requestCountAfterFirstLoad > 0, true);
  assert.equal(requestCountAfterSecondSelect, requestCountAfterFirstLoad);
  assert.match(doc.byId["document-details"].innerHTML, /Document structure/);
});
