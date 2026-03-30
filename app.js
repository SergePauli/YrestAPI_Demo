const docTypes = [
  {
    id: "invoice",
    code: "INV",
    name: "Invoice",
    accent: "VAT, goods, and services",
  },
  {
    id: "act",
    code: "ACT",
    name: "Service acceptance act",
    accent: "Proof of completion",
  },
  {
    id: "payment_order",
    code: "PO",
    name: "Payment order",
    accent: "Banking document",
  },
  {
    id: "receipt",
    code: "GRN",
    name: "Goods receipt note",
    accent: "Inventory intake",
  },
];

const documents = [
  {
    id: 1001,
    number: "INV-240315-17",
    date: "2026-03-15",
    status: "Posted",
    amount: 124500.0,
    currency: "RUB",
    summary:
      "Invoice for delivery of laptops and peripherals for the administrative department.",
    counterparty: {
      name: 'Orion Supply LLC',
      inn: "7704123456",
      kpp: "770401001",
    },
    doc_type: docTypes[0],
    nodes: [
      {
        id: 2001,
        parent_id: null,
        doc_type_node: {
          key: "header",
          name: "Document header",
          description: "General invoice metadata",
        },
        attributes: [
          { name: "Organization", value: 'Demo Import LLC' },
          { name: "Warehouse", value: "Main warehouse" },
          { name: "Basis", value: "Supply agreement No. 42/24" },
        ],
        children: [],
      },
      {
        id: 2002,
        parent_id: null,
        doc_type_node: {
          key: "lines",
          name: "Line items",
          description: "Document line specification",
        },
        attributes: [{ name: "Rows", value: "2" }],
        children: [
          {
            id: 2003,
            parent_id: 2002,
            doc_type_node: {
              key: "line",
              name: 'Row 1 "Laptop"',
              description: "Equipment delivery",
            },
            attributes: [
              { name: "Item", value: "ThinkBook 14 laptop" },
              { name: "Quantity", value: "5 pcs" },
              { name: "Price", value: "21 000.00 RUB" },
              { name: "VAT rate", value: "20%" },
            ],
            children: [],
          },
          {
            id: 2004,
            parent_id: 2002,
            doc_type_node: {
              key: "line",
              name: 'Row 2 "Monitor"',
              description: "Equipment delivery",
            },
            attributes: [
              { name: "Item", value: "24-inch monitor" },
              { name: "Quantity", value: "5 pcs" },
              { name: "Price", value: "3 900.00 RUB" },
              { name: "VAT rate", value: "20%" },
            ],
            children: [],
          },
        ],
      },
      {
        id: 2005,
        parent_id: null,
        doc_type_node: {
          key: "totals",
          name: "Totals",
          description: "Document totals",
        },
        attributes: [
          { name: "Amount before VAT", value: "103 750.00 RUB" },
          { name: "VAT", value: "20 750.00 RUB" },
          { name: "Grand total", value: "124 500.00 RUB" },
        ],
        children: [],
      },
    ],
  },
  {
    id: 1002,
    number: "ACT-240318-04",
    date: "2026-03-18",
    status: "Signed",
    amount: 48000.0,
    currency: "RUB",
    summary:
      "Service acceptance act for YrestAPI implementation and configuration for the internal contract registry.",
    counterparty: {
      name: 'Gromov A.A. Sole Proprietor',
      inn: "781602938475",
      kpp: "N/A",
    },
    doc_type: docTypes[1],
    nodes: [
      {
        id: 2101,
        parent_id: null,
        doc_type_node: {
          key: "contract",
          name: "Service basis",
          description: "Agreement and work period details",
        },
        attributes: [
          { name: "Agreement", value: "No. 11-IT dated 2026-03-01" },
          { name: "Period", value: "2026-03-01 - 2026-03-15" },
          { name: "Owner", value: "Project office" },
        ],
        children: [],
      },
      {
        id: 2102,
        parent_id: null,
        doc_type_node: {
          key: "services",
          name: "Service list",
          description: "Scope of completed work",
        },
        attributes: [{ name: "Services", value: "3" }],
        children: [
          {
            id: 2103,
            parent_id: 2102,
            doc_type_node: {
              key: "service",
              name: "Data model audit",
              description: "Validation of structure and presets",
            },
            attributes: [
              { name: "Hours", value: "8" },
              { name: "Rate", value: "2 000.00 RUB" },
            ],
            children: [],
          },
          {
            id: 2104,
            parent_id: 2102,
            doc_type_node: {
              key: "service",
              name: "YAML model design",
              description: "Definition of relations and presets",
            },
            attributes: [
              { name: "Hours", value: "10" },
              { name: "Rate", value: "2 000.00 RUB" },
            ],
            children: [],
          },
          {
            id: 2105,
            parent_id: 2102,
            doc_type_node: {
              key: "service",
              name: "Demo interface preparation",
              description: "Frontend demonstration as a static SPA",
            },
            attributes: [
              { name: "Hours", value: "6" },
              { name: "Rate", value: "2 000.00 RUB" },
            ],
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 1003,
    number: "PO-240320-88",
    date: "2026-03-20",
    status: "Sent to bank",
    amount: 124500.0,
    currency: "RUB",
    summary:
      "Payment order to settle the invoice issued by the computer equipment supplier.",
    counterparty: {
      name: 'Northern Bank JSC',
      inn: "7707083893",
      kpp: "773601001",
    },
    doc_type: docTypes[2],
    nodes: [
      {
        id: 2201,
        parent_id: null,
        doc_type_node: {
          key: "payment",
          name: "Payment details",
          description: "Core banking parameters",
        },
        attributes: [
          { name: "Payer account", value: "40702810900000010293" },
          { name: "Bank BIC", value: "044525225" },
          { name: "Priority", value: "5" },
          { name: "Payment mode", value: "Electronic" },
        ],
        children: [],
      },
      {
        id: 2202,
        parent_id: null,
        doc_type_node: {
          key: "purpose",
          name: "Payment purpose",
          description: "Purpose text for the bank and supplier",
        },
        attributes: [
          {
            name: "Text",
            value:
              "Payment for invoice INV-240315-17 dated 2026-03-15, including 20% VAT.",
          },
          { name: "Budget code", value: "Not applicable" },
        ],
        children: [],
      },
    ],
  },
  {
    id: 1004,
    number: "GRN-240322-06",
    date: "2026-03-22",
    status: "Received into stock",
    amount: 78300.0,
    currency: "RUB",
    summary:
      "Goods receipt note for service materials and packaging used for shipment preparation.",
    counterparty: {
      name: 'Logistic Trade LLC',
      inn: "5408123490",
      kpp: "540801001",
    },
    doc_type: docTypes[3],
    nodes: [
      {
        id: 2301,
        parent_id: null,
        doc_type_node: {
          key: "warehouse",
          name: "Warehouse intake",
          description: "Receiving and warehouse details",
        },
        attributes: [
          { name: "Warehouse", value: "Service department warehouse" },
          { name: "Responsible person", value: "P. M. Kiselev" },
          { name: "Supplier document", value: "TORG-12 No. 551" },
        ],
        children: [],
      },
      {
        id: 2302,
        parent_id: null,
        doc_type_node: {
          key: "materials",
          name: "Materials",
          description: "Received items",
        },
        attributes: [{ name: "Items", value: "3" }],
        children: [
          {
            id: 2303,
            parent_id: 2302,
            doc_type_node: {
              key: "material",
              name: "Twisted pair cable",
              description: "Material for installation work",
            },
            attributes: [
              { name: "Quantity", value: "300 m" },
              { name: "Price", value: "62.00 RUB" },
            ],
            children: [],
          },
          {
            id: 2304,
            parent_id: 2302,
            doc_type_node: {
              key: "material",
              name: "Bubble wrap",
              description: "Packaging material",
            },
            attributes: [
              { name: "Quantity", value: "20 rolls" },
              { name: "Price", value: "540.00 RUB" },
            ],
            children: [],
          },
          {
            id: 2305,
            parent_id: 2302,
            doc_type_node: {
              key: "material",
              name: "Label stickers",
              description: "Warehouse consumables",
            },
            attributes: [
              { name: "Quantity", value: "40 packs" },
              { name: "Price", value: "420.00 RUB" },
            ],
            children: [],
          },
        ],
      },
    ],
  },
];

function createInitialState() {
  return {
    search: "",
    typeId: "all",
    selectedDocumentId: documents[0]?.id ?? null,
    heroPinnedCollapsed: false,
    heroForcedVisible: false,
    heroStats: null,
    lastRegistryScrollTop: 0,
    lastDetailsScrollTop: 0,
  };
}

function createElements(doc) {
  return {
    pageShell: doc?.getElementById("page-shell") ?? null,
    heroStats: doc?.getElementById("hero-stats") ?? null,
    documentCount: doc?.getElementById("document-count") ?? null,
    typeFilter: doc?.getElementById("type-filter") ?? null,
    searchInput: doc?.getElementById("search-input") ?? null,
    documentList: doc?.getElementById("document-list") ?? null,
    details: doc?.getElementById("document-details") ?? null,
    detailsPanel: doc?.querySelector(".details") ?? null,
  };
}

function formatMoney(value, currency) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function flattenNodes(nodes, level = 0, parentPath = "") {
  return nodes.flatMap((node, index) => {
    const path = parentPath ? `${parentPath}.${index + 1}` : `${index + 1}`;
    const current = { ...node, level, path };
    return [current, ...flattenNodes(node.children, level + 1, path)];
  });
}

function countAllNodes(items) {
  return items.reduce((total, document) => total + flattenNodes(document.nodes).length, 0);
}

function buildStatRequest(app) {
  const filters = {};
  if (app.state.typeId !== "all") {
    const docType = app.docTypes.find((item) => item.id === app.state.typeId);
    if (docType) {
      filters["doc_type.code__eq"] = docType.code;
    }
  }

  return {
    model: "Document",
    filters,
    aggregates: {
      total_amount: { fn: "sum", field: "amount" },
      avg_amount: { fn: "avg", field: "amount" },
      min_date: { fn: "min", field: "document_date" },
      max_date: { fn: "max", field: "document_date" },
    },
  };
}

function withNodePaths(nodes, parentPath = "") {
  return nodes.map((node, index) => {
    const path = parentPath ? `${parentPath}.${index + 1}` : `${index + 1}`;
    return {
      ...node,
      path,
      children: withNodePaths(node.children, path),
    };
  });
}

function canRenderChildrenAsTable(node) {
  if (node.doc_type_node?.render === "cards") return false;
  if (!node.children.length) return false;

  const [firstChild] = node.children;
  if (!firstChild || firstChild.children.length) return false;

  const sameNodeType = node.children.every(
    (child) =>
      child.doc_type_node.key === firstChild.doc_type_node.key && child.children.length === 0
  );

  if (!sameNodeType) return false;

  const columnNames = firstChild.attributes.map((attribute) => attribute.name);
  if (!columnNames.length) return false;

  return node.children.every((child) => {
    if (child.attributes.length !== columnNames.length) return false;
    return child.attributes.every((attribute, index) => attribute.name === columnNames[index]);
  });
}

function renderAttributes(attributes) {
  if (!attributes.length) return "";
  return `
    <div class="attribute-list">
      ${attributes
        .map(
          (attribute) => `
            <article class="attribute-card">
              <span class="attribute-name">${attribute.name}</span>
              <strong class="attribute-value">${attribute.value}</strong>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderChildrenTable(node) {
  const columns = node.children[0].attributes.map((attribute) => attribute.name);

  return `
    <div class="node-table-wrap">
      <table class="node-table">
        <thead>
          <tr>
            <th>Row</th>
            ${columns.map((column) => `<th>${column}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${node.children
            .map(
              (child, index) => `
                <tr>
                  <td>${index + 1}</td>
                  ${child.attributes.map((attribute) => `<td>${attribute.value}</td>`).join("")}
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderNode(node) {
  return `
    <article class="node-card">
      <div class="node-meta">
        <div>
          <span class="node-path">Node ${node.path} · ${node.doc_type_node.key}</span>
          <h4>${node.doc_type_node.name}</h4>
        </div>
        <span class="chip">${node.children.length} children</span>
      </div>
      <p>${node.doc_type_node.description}</p>
      ${renderAttributes(node.attributes)}
      ${
        node.children.length
          ? canRenderChildrenAsTable(node)
            ? renderChildrenTable(node)
            : `<div class="node-children">${node.children.map((child) => renderNode(child)).join("")}</div>`
          : ""
      }
    </article>
  `;
}

function getFilteredDocuments(app) {
  const query = app.state.search.trim().toLowerCase();
  return app.documents.filter((document) => {
    const matchesType = app.state.typeId === "all" || document.doc_type.id === app.state.typeId;
    if (!matchesType) return false;

    if (!query) return true;

    const haystack = [
      document.number,
      document.summary,
      document.counterparty.name,
      document.counterparty.inn,
      document.doc_type.name,
      ...flattenNodes(document.nodes).flatMap((node) => [
        node.doc_type_node.name,
        node.doc_type_node.description,
        ...node.attributes.map((attribute) => `${attribute.name} ${attribute.value}`),
      ]),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

function ensureSelection(app, filteredDocuments) {
  if (!filteredDocuments.some((document) => document.id === app.state.selectedDocumentId)) {
    app.state.selectedDocumentId = filteredDocuments[0]?.id ?? null;
  }
}

function buildLocalHeroStats(app) {
  const filteredDocuments = getFilteredDocuments(app);
  const totalAmount = filteredDocuments.reduce((sum, document) => sum + document.amount, 0);
  const dates = filteredDocuments.map((document) => document.date).sort();

  return [
    { label: "Documents", value: String(filteredDocuments.length) },
    { label: "Total amount", value: formatMoney(totalAmount, "RUB") },
    {
      label: "Average amount",
      value:
        filteredDocuments.length > 0
          ? formatMoney(totalAmount / filteredDocuments.length, "RUB")
          : formatMoney(0, "RUB"),
    },
    {
      label: "Date range",
      value:
        dates.length > 0 ? `${formatDate(dates[0])} - ${formatDate(dates[dates.length - 1])}` : "N/A",
    },
  ];
}

function buildRemoteHeroStats(_app, payload) {
  if (!payload || typeof payload !== "object") return null;

  const aggregates = payload.aggregates ?? {};
  const minDate = aggregates.min_date;
  const maxDate = aggregates.max_date;

  return [
    { label: "Documents", value: String(payload.count ?? 0) },
    {
      label: "Total amount",
      value: formatMoney(Number(aggregates.total_amount ?? 0), "RUB"),
    },
    {
      label: "Average amount",
      value: formatMoney(Number(aggregates.avg_amount ?? 0), "RUB"),
    },
    {
      label: "Date range",
      value: minDate && maxDate ? `${formatDate(minDate)} - ${formatDate(maxDate)}` : "N/A",
    },
  ];
}

function renderStats(app) {
  if (!app.elements.heroStats) return;

  const stats = app.state.heroStats ?? buildLocalHeroStats(app);

  app.elements.heroStats.innerHTML = stats
    .map(
      (stat) => `
        <article class="stat-card">
          <span>${stat.label}</span>
          <strong>${stat.value}</strong>
        </article>
      `
    )
    .join("");
}

async function loadHeroStats(app) {
  if (typeof app.fetchImpl !== "function") return;

  try {
    const response = await app.fetchImpl(`${app.apiBaseUrl}/api/stat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildStatRequest(app)),
    });

    if (!response?.ok) {
      throw new Error(`HTTP ${response?.status ?? "unknown"}`);
    }

    const payload = await response.json();
    const stats = buildRemoteHeroStats(app, payload);
    if (!stats) return;
    app.state.heroStats = stats;
    renderStats(app);
  } catch (_error) {
    app.state.heroStats = null;
    renderStats(app);
  }
}

function renderTypeFilter(app) {
  if (!app.elements.typeFilter) return;

  const options = [
    '<option value="all">All document types</option>',
    ...app.docTypes.map((type) => `<option value="${type.id}">${type.code} · ${type.name}</option>`),
  ];

  app.elements.typeFilter.innerHTML = options.join("");
  app.elements.typeFilter.value = app.state.typeId;
}

function renderDocumentList(app, filteredDocuments) {
  if (!app.elements.documentList || !app.elements.documentCount) return;

  app.elements.documentCount.textContent = `${filteredDocuments.length} items`;

  if (!filteredDocuments.length) {
    app.elements.documentList.innerHTML = `
      <div class="empty-state">
        <h3>No documents found</h3>
        <p>Adjust the filter or search query.</p>
      </div>
    `;
    return;
  }

  app.elements.documentList.innerHTML = filteredDocuments
    .map((document) => {
      const isActive = document.id === app.state.selectedDocumentId;
      return `
        <button class="doc-card ${isActive ? "active" : ""}" data-id="${document.id}" type="button">
          <div class="doc-topline">
            <span class="doc-type-pill">${document.doc_type.code}</span>
            <div>
              <h3>${document.number}</h3>
              <p class="doc-subtitle">${document.counterparty.name}</p>
            </div>
            <span class="mono">${formatDate(document.date)}</span>
          </div>
          <p class="doc-subtitle">${document.summary}</p>
          <div class="doc-metrics">
            <div class="metric">
              <span class="meta-label">Status</span>
              <strong>${document.status}</strong>
            </div>
            <div class="metric">
              <span class="meta-label">Amount</span>
              <strong>${formatMoney(document.amount, document.currency)}</strong>
            </div>
          </div>
        </button>
      `;
    })
    .join("");

  app.elements.documentList.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      app.state.selectedDocumentId = Number(button.dataset.id);
      app.render();
      if (app.elements.detailsPanel) {
        app.elements.detailsPanel.scrollTop = 0;
      }
      app.syncHeroVisibility();
    });
  });
}

function renderDetails(app, document) {
  if (!app.elements.details) return;

  if (!document) {
    app.elements.details.innerHTML = `
      <div class="empty-state">
        <h3>No document selected</h3>
        <p>Select a record from the registry on the left.</p>
      </div>
    `;
    return;
  }

  const flatNodes = flattenNodes(document.nodes);
  const attributeCount = flatNodes.reduce((total, node) => total + node.attributes.length, 0);

  app.elements.details.innerHTML = `
    <section class="detail-header">
      <div class="detail-topline">
        <div class="detail-number-block">
          <p class="panel-kicker">Document number</p>
          <h2>${document.number}</h2>
        </div>
        <div class="detail-title-block">
          <p class="panel-kicker">${document.doc_type.name}</p>
          <h2>${document.doc_type.code} · ${document.doc_type.accent}</h2>
        </div>
      </div>
      <p class="detail-summary">${document.summary}</p>
      <div class="detail-badges detail-badges-column">
        <span class="chip">${document.status}</span>
        <span class="chip">${formatMoney(document.amount, document.currency)}</span>
        <span class="chip">${document.counterparty.inn}</span>
      </div>
    </section>

    <section class="meta-grid">
      <article class="meta-card">
        <span class="meta-label">Date</span>
        <strong class="meta-value">${formatDate(document.date)}</strong>
        <p>Document issue date</p>
      </article>
      <article class="meta-card">
        <span class="meta-label">Counterparty</span>
        <strong class="meta-value">${document.counterparty.name}</strong>
        <p>TIN ${document.counterparty.inn}, Tax reg. code ${document.counterparty.kpp}</p>
      </article>
      <article class="meta-card">
        <span class="meta-label">Document nodes</span>
        <strong class="meta-value">${flatNodes.length}</strong>
        <p>Including nested sections and rows</p>
      </article>
      <article class="meta-card">
        <span class="meta-label">Attributes</span>
        <strong class="meta-value">${attributeCount}</strong>
        <p>Metadata, values, and service fields</p>
      </article>
    </section>

    <section>
      <div class="section-head">
        <h3>Document structure</h3>
        <span class="mono">${document.doc_type.code} · ${document.doc_type.accent}</span>
      </div>
      <div class="nodes-root">
        ${withNodePaths(document.nodes).map((node) => renderNode(node)).join("")}
      </div>
    </section>
  `;
}

function syncHeroVisibility(app) {
  const heroCollapsed = app.state.heroPinnedCollapsed && !app.state.heroForcedVisible;
  const heroPeek = app.state.heroPinnedCollapsed && app.state.heroForcedVisible;
  app.elements.pageShell?.classList.toggle("hero-collapsed", heroCollapsed);
  app.elements.pageShell?.classList.toggle("hero-peek", heroPeek);
}

function handlePaneScroll(app, kind) {
  const isRegistry = kind === "registry";
  const target = isRegistry ? app.elements.documentList : app.elements.detailsPanel;
  const currentScrollTop = target?.scrollTop ?? 0;
  const lastKey = isRegistry ? "lastRegistryScrollTop" : "lastDetailsScrollTop";
  const previousScrollTop = app.state[lastKey];

  if (currentScrollTop > previousScrollTop && currentScrollTop > 8) {
    app.state.heroPinnedCollapsed = true;
    app.state.heroForcedVisible = false;
  }

  app.state[lastKey] = currentScrollTop;
  syncHeroVisibility(app);
}

function bindEvents(app) {
  app.elements.searchInput?.addEventListener("input", (event) => {
    app.state.search = event.target.value;
    app.render();
  });

  app.elements.typeFilter?.addEventListener("change", (event) => {
    app.state.typeId = event.target.value;
    app.render();
    void app.loadHeroStats();
  });

  app.elements.documentList?.addEventListener("scroll", () => handlePaneScroll(app, "registry"), {
    passive: true,
  });
  app.elements.detailsPanel?.addEventListener("scroll", () => handlePaneScroll(app, "details"), {
    passive: true,
  });

  app.win?.addEventListener(
    "mousemove",
    (event) => {
      if (event.clientY <= 24 && app.state.heroPinnedCollapsed) {
        app.state.heroForcedVisible = true;
        syncHeroVisibility(app);
      }
    },
    { passive: true }
  );
}

function createApp({
  doc = globalThis.document,
  win = globalThis.window,
  fetchImpl = globalThis.fetch,
  apiBaseUrl = "",
} = {}) {
  const app = {
    doc,
    win,
    fetchImpl,
    apiBaseUrl,
    docTypes,
    documents,
    state: createInitialState(),
    elements: createElements(doc),
    render() {
      const filteredDocuments = getFilteredDocuments(app);
      ensureSelection(app, filteredDocuments);
      app.state.heroStats = null;
      renderStats(app);
      renderDocumentList(app, filteredDocuments);
      renderDetails(
        app,
        filteredDocuments.find((document) => document.id === app.state.selectedDocumentId)
      );
      syncHeroVisibility(app);
    },
    renderStats() {
      renderStats(app);
    },
    loadHeroStats() {
      return loadHeroStats(app);
    },
    renderTypeFilter() {
      renderTypeFilter(app);
    },
    bindEvents() {
      bindEvents(app);
    },
    syncHeroVisibility() {
      syncHeroVisibility(app);
    },
    handlePaneScroll(kind) {
      handlePaneScroll(app, kind);
    },
    init() {
      app.renderStats();
      app.renderTypeFilter();
      app.bindEvents();
      app.render();
      void app.loadHeroStats();
      return app;
    },
  };

  return app;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    canRenderChildrenAsTable,
    countAllNodes,
    createApp,
    createInitialState,
    buildLocalHeroStats,
    buildRemoteHeroStats,
    buildStatRequest,
    docTypes,
    documents,
    flattenNodes,
    formatDate,
    formatMoney,
    renderAttributes,
    renderChildrenTable,
    renderNode,
    withNodePaths,
  };
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.YrestDemoApp = createApp({ doc: document, win: window }).init();
}
