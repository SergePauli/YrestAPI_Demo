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

let createYrestApiClient = null;
const DEFAULT_REGISTRY_CARD_HEIGHT = 176;
const DEFAULT_REGISTRY_CARD_GAP = 12;

if (typeof module !== "undefined" && module.exports) {
  ({ createYrestApiClient } = require("./yrest-client.js"));
} else {
  createYrestApiClient = globalThis.YrestApiClient?.createYrestApiClient ?? null;
}

function resolveBrowserApiBaseUrl(win) {
  const queryValue = win?.location ? new URLSearchParams(win.location.search).get("apiBaseUrl") : null;
  if (queryValue) return queryValue.replace(/\/$/, "");

  if (typeof win?.YREST_API_BASE_URL === "string" && win.YREST_API_BASE_URL.trim()) {
    return win.YREST_API_BASE_URL.trim().replace(/\/$/, "");
  }

  const protocol = win?.location?.protocol;
  const hostname = win?.location?.hostname;
  const port = win?.location?.port;

  if (protocol === "file:") {
    return "http://localhost:8080";
  }

  if ((hostname === "localhost" || hostname === "127.0.0.1") && port && port !== "8080") {
    return `http://${hostname}:8080`;
  }

  return "";
}

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
    selectedDocumentId: null,
    selectedDocumentDetail: null,
    detailCache: new Map(),
    detailLoading: false,
    detailLoadError: false,
    detailRequestId: 0,
    registryScrollRafId: null,
    registryPendingLoad: false,
    registryPendingForce: false,
    heroPinnedCollapsed: false,
    heroForcedVisible: false,
    heroStats: null,
    heroStatsLoaded: false,
    lastRegistryScrollTop: 0,
    lastDetailsScrollTop: 0,
    registryCache: new Map(),
    registryTotalCount: documents.length,
    registryOffset: 0,
    registryLimit: 0,
    registryRequestedOffset: 0,
    registryRequestedLimit: 0,
    registryLoading: false,
    registryLoadError: false,
    registryRequestId: 0,
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

function buildRegistryFilters(app, extraFilters = {}) {
  const filters = {};

  if (app.state.typeId !== "all") {
    const docType = app.docTypes.find((item) => item.id === app.state.typeId);
    if (docType) {
      filters["doc_type.code__eq"] = docType.code;
    }
  }

  if (app.state.search.trim()) {
    filters["number_or_counterparty.name_or_counterparty.tin_or_summary__cnt"] = app.state.search.trim();
  }

  return {
    ...filters,
    ...extraFilters,
  };
}

function buildStatRequest(app) {
  return {
    model: "Document",
    filters: {},
    aggregates: {
      total_amount: { fn: "sum", field: "amount" },
      avg_amount: { fn: "avg", field: "amount" },
      min_date: { fn: "min", field: "document_date" },
      max_date: { fn: "max", field: "document_date" },
    },
  };
}

function buildRegistryStatRequest(app) {
  return {
    model: "Document",
    filters: buildRegistryFilters(app),
  };
}

function buildRegistryPageRequest(app, { preset, offset = 0, limit = 20, filters = {} } = {}) {
  return {
    model: "Document",
    preset,
    offset,
    limit,
    filters: buildRegistryFilters(app, filters),
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

function isRemoteRegistryEnabled(app) {
  return Boolean(app.apiClient && typeof app.fetchImpl === "function" && !app.state.registryLoadError);
}

function getRegistryDocuments(app) {
  if (!isRemoteRegistryEnabled(app)) {
    return getFilteredDocuments(app);
  }

  return [...app.state.registryCache.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, document]) => document);
}

function getRegistryTotalCount(app) {
  return isRemoteRegistryEnabled(app) ? app.state.registryTotalCount : getFilteredDocuments(app).length;
}

function getSelectedDocument(app) {
  if (isRemoteRegistryEnabled(app)) {
    return app.state.selectedDocumentDetail;
  }

  return getRegistryDocuments(app).find((document) => document.id === app.state.selectedDocumentId) ?? null;
}

function ensureSelection(app, registryDocuments) {
  if (
    app.state.selectedDocumentId !== null &&
    !registryDocuments.some((document) => document.id === app.state.selectedDocumentId)
  ) {
    app.state.selectedDocumentId = null;
    app.state.selectedDocumentDetail = null;
  }
}

function buildLocalHeroStats(app) {
  const totalAmount = app.documents.reduce((sum, document) => sum + document.amount, 0);
  const dates = app.documents.map((document) => document.date).sort();

  return [
    { label: "Documents", value: String(app.documents.length) },
    { label: "Total amount", value: formatMoney(totalAmount, "RUB") },
    {
      label: "Average amount",
      value:
        app.documents.length > 0
          ? formatMoney(totalAmount / app.documents.length, "RUB")
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
  const visibleStats = stats.filter(
    (stat) =>
      stat.label === "Documents" ||
      stat.label === "Total amount" ||
      stat.label === "Date range"
  );

  app.elements.heroStats.innerHTML = visibleStats
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

function renderRegistryViewport(app) {
  const registryDocuments = getRegistryDocuments(app);
  renderDocumentList(app, registryDocuments);
}

async function loadHeroStats(app) {
  if (!app.apiClient || app.state.heroStatsLoaded) return;

  try {
    const payload = await app.apiClient.fetchStats(buildStatRequest(app));
    const stats = buildRemoteHeroStats(app, payload);
    if (!stats) return;
    app.state.heroStats = stats;
    app.state.heroStatsLoaded = true;
    renderStats(app);
  } catch (_error) {
    app.state.registryLoadError = true;
    app.state.heroStats = null;
    app.win?.console?.warn?.(
      `YrestAPI stats request failed for ${app.apiBaseUrl || "same-origin"}; falling back to local demo data.`
    );
    renderStats(app);
    app.render();
  }
}

async function loadRegistryStats(app) {
  if (!app.apiClient) return;

  try {
    const payload = await app.apiClient.fetchStats(buildRegistryStatRequest(app));
    app.state.registryTotalCount = Number(payload?.count ?? 0);
    app.state.registryLoadError = false;
  } catch (_error) {
    app.state.registryLoadError = true;
    app.state.registryTotalCount = documents.length;
    app.win?.console?.warn?.(
      `YrestAPI registry stats request failed for ${app.apiBaseUrl || "same-origin"}; falling back to local demo data.`
    );
  }
}

function getRegistryViewportHeight(app) {
  return app.elements.documentList?.clientHeight ?? app.elements.documentList?.offsetHeight ?? 720;
}

function readCssPixelValue(win, element, propertyName, fallback) {
  if (!win || !element || typeof win.getComputedStyle !== "function") {
    return fallback;
  }

  const rawValue = win.getComputedStyle(element).getPropertyValue(propertyName).trim();
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getRegistryMetrics(app) {
  const listElement = app.elements.documentList;
  const cardHeight = readCssPixelValue(
    app.win,
    listElement,
    "--registry-card-height",
    DEFAULT_REGISTRY_CARD_HEIGHT
  );
  const rowGap = readCssPixelValue(
    app.win,
    listElement,
    "--registry-row-gap",
    DEFAULT_REGISTRY_CARD_GAP
  );

  return {
    cardHeight,
    rowGap,
    rowStride: cardHeight + rowGap,
  };
}

function getRegistryItemHeightEstimate(app) {
  return getRegistryMetrics(app).rowStride;
}

function getRegistryBatchSize(app) {
  const viewportHeight = getRegistryViewportHeight(app);
  const visibleCount = Math.max(1, Math.ceil(viewportHeight / getRegistryItemHeightEstimate(app)));
  return Math.max(visibleCount * 2, 12);
}

function getRegistryRenderWindow(app, documentsToRender) {
  if (!isRemoteRegistryEnabled(app)) {
    return {
      offset: 0,
      totalCount: documentsToRender.length,
    };
  }

  if (app.state.registryLoading && app.state.registryRequestedLimit > 0) {
    return {
      offset: app.state.registryRequestedOffset,
      totalCount: app.state.registryTotalCount,
    };
  }

  return {
    offset: app.state.registryOffset,
    totalCount: app.state.registryTotalCount,
  };
}

function renderRegistrySkeletonCard() {
  return `
    <article class="doc-card doc-card-skeleton" aria-hidden="true">
      <div class="doc-topline">
        <span class="doc-type-pill skeleton-block skeleton-pill"></span>
        <div>
          <div class="skeleton-block skeleton-title"></div>
          <div class="skeleton-block skeleton-line skeleton-line-mid"></div>
        </div>
        <span class="skeleton-block skeleton-date"></span>
      </div>
      <div class="skeleton-block skeleton-line"></div>
      <div class="skeleton-block skeleton-line skeleton-line-short"></div>
      <div class="doc-metrics">
        <div class="metric">
          <span class="skeleton-block skeleton-metric-label"></span>
          <span class="skeleton-block skeleton-metric-value"></span>
        </div>
        <div class="metric">
          <span class="skeleton-block skeleton-metric-label"></span>
          <span class="skeleton-block skeleton-metric-value"></span>
        </div>
      </div>
    </article>
  `;
}

function renderRegistryCard(document, isActive) {
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
          <strong>${document.status}</strong>
        </div>
        <div class="metric">
          <strong>${formatMoney(document.amount, document.currency)}</strong>
        </div>
      </div>
    </button>
  `;
}

function getRegistryWindow(app) {
  const totalCount = app.state.registryTotalCount;
  const limit = Math.min(getRegistryBatchSize(app), totalCount);
  const itemHeight = getRegistryItemHeightEstimate(app);
  const scrollTop = app.elements.documentList?.scrollTop ?? 0;
  const firstVisibleIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
  const visibleCount = Math.max(1, Math.ceil(getRegistryViewportHeight(app) / itemHeight));
  const bufferBefore = Math.max(0, Math.floor((limit - visibleCount) / 2));
  const maxOffset = Math.max(0, totalCount - limit);
  const offset = Math.min(Math.max(0, firstVisibleIndex - bufferBefore), maxOffset);

  return {
    offset,
    limit,
    visibleCount,
    firstVisibleIndex,
  };
}

function registryWindowCovered(app, windowState) {
  const visibleStart = Math.max(0, windowState.firstVisibleIndex);
  const visibleEnd = Math.min(
    app.state.registryTotalCount,
    visibleStart + windowState.visibleCount + Math.max(1, Math.floor(windowState.visibleCount / 2))
  );

  for (let index = visibleStart; index < visibleEnd; index += 1) {
    if (!app.state.registryCache.has(index)) {
      return false;
    }
  }

  return true;
}

function pruneRegistryCache(app, windowState) {
  if (app.state.registryTotalCount <= 5000) {
    return;
  }

  const keepFrom = Math.max(0, windowState.offset - windowState.limit * 3);
  const keepTo = Math.min(
    app.state.registryTotalCount,
    windowState.offset + windowState.limit * 4
  );

  for (const index of app.state.registryCache.keys()) {
    if (index < keepFrom || index >= keepTo) {
      app.state.registryCache.delete(index);
    }
  }
}

function mergeRegistryItems(app, offset, items, windowState) {
  items.forEach((item, index) => {
    app.state.registryCache.set(offset + index, item);
  });
  pruneRegistryCache(app, windowState);
}

function getRegistryRenderEntries(app, windowState) {
  const entries = [];
  const end = Math.min(app.state.registryTotalCount, windowState.offset + windowState.limit);

  for (let index = windowState.offset; index < end; index += 1) {
    entries.push({
      index,
      document: app.state.registryCache.get(index) ?? null,
    });
  }

  return entries;
}

async function loadRegistryPage(app, { force = false } = {}) {
  if (!isRemoteRegistryEnabled(app)) return;
  if (app.state.registryTotalCount <= 0) {
    app.state.registryCache = new Map();
    app.state.registryOffset = 0;
    app.state.registryLimit = 0;
    app.render();
    return;
  }

  const windowState = getRegistryWindow(app);
  if (!windowState.limit) return;
  if (!force && registryWindowCovered(app, windowState)) return;

  if (app.state.registryLoading) {
    app.state.registryPendingLoad = true;
    app.state.registryPendingForce = app.state.registryPendingForce || force;
    app.state.registryRequestedOffset = windowState.offset;
    app.state.registryRequestedLimit = windowState.limit;
    return;
  }

  const requestId = app.state.registryRequestId + 1;
  app.state.registryRequestId = requestId;
  app.state.registryRequestedOffset = windowState.offset;
  app.state.registryRequestedLimit = windowState.limit;
  app.state.registryLoading = true;
  app.render();

  try {
    const payload = await app.apiClient.fetchPresetPage(
      buildRegistryPageRequest(app, {
        preset: "list_item",
        offset: windowState.offset,
        limit: windowState.limit,
      })
    );

    if (requestId !== app.state.registryRequestId) return;

    const items = Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
          ? payload
          : [];

    mergeRegistryItems(app, windowState.offset, items, windowState);
    app.state.registryOffset = windowState.offset;
    app.state.registryLimit = windowState.limit;
    app.state.registryRequestedOffset = windowState.offset;
    app.state.registryRequestedLimit = windowState.limit;
    app.state.registryLoading = false;
    if (typeof payload?.count === "number") {
      app.state.registryTotalCount = payload.count;
    }
    app.render();
    if (app.state.registryPendingLoad) {
      const pendingForce = app.state.registryPendingForce;
      app.state.registryPendingLoad = false;
      app.state.registryPendingForce = false;
      scheduleRegistryViewportWork(app, { force: pendingForce });
    }
  } catch (_error) {
    if (requestId !== app.state.registryRequestId) return;
    app.state.registryLoading = false;
    app.state.registryLoadError = true;
    app.win?.console?.warn?.(
      `YrestAPI registry request failed for ${app.apiBaseUrl || "same-origin"}; falling back to local demo data.`
    );
    app.render();
  }
}

async function refreshRegistry(app) {
  if (isRemoteRegistryEnabled(app)) {
    app.state.registryCache = new Map();
    app.state.registryOffset = 0;
    app.state.registryLimit = 0;
    app.state.registryRequestedOffset = 0;
    app.state.registryRequestedLimit = 0;
    app.state.registryPendingLoad = false;
    app.state.registryPendingForce = false;
    app.state.registryTotalCount = 0;
    app.state.selectedDocumentId = null;
    app.state.selectedDocumentDetail = null;
    app.state.detailCache = new Map();
    app.state.detailLoading = false;
    app.state.detailLoadError = false;
    if (app.elements.documentList) {
      app.elements.documentList.scrollTop = 0;
    }
    app.render();
    await loadRegistryStats(app);
    if (!app.state.registryLoadError) {
      await app.loadRegistryPage({ force: true });
    } else {
      app.render();
    }
    return;
  }

  app.render();
}

async function loadSelectedDocumentDetail(app, documentId) {
  if (!isRemoteRegistryEnabled(app) || !app.apiClient || documentId === null) return;

  const cached = app.state.detailCache.get(documentId) ?? null;
  if (cached) {
    app.state.selectedDocumentDetail = cached;
    app.state.detailLoading = false;
    app.state.detailLoadError = false;
    app.render();
    return;
  }

  const requestId = app.state.detailRequestId + 1;
  app.state.detailRequestId = requestId;
  app.state.detailLoading = true;
  app.state.detailLoadError = false;
  app.state.selectedDocumentDetail = null;
  app.render();

  try {
    const item = await app.apiClient.fetchPresetItem({
      model: "Document",
      preset: "detail",
      id: documentId,
    });

    if (requestId !== app.state.detailRequestId) return;
    if (app.state.selectedDocumentId !== documentId) return;

    app.state.detailLoading = false;
    if (!item) {
      app.state.detailLoadError = true;
      app.state.selectedDocumentDetail = null;
      app.render();
      return;
    }

    app.state.detailCache.set(documentId, item);
    app.state.selectedDocumentDetail = item;
    app.render();
  } catch (_error) {
    if (requestId !== app.state.detailRequestId) return;
    app.state.detailLoading = false;
    app.state.detailLoadError = true;
    app.state.selectedDocumentDetail = null;
    app.render();
  }
}

function selectDocument(app, documentId) {
  if (app.state.selectedDocumentId === documentId) {
    return;
  }

  app.state.selectedDocumentId = documentId;

  if (!isRemoteRegistryEnabled(app)) {
    app.render();
    if (app.elements.detailsPanel) {
      app.elements.detailsPanel.scrollTop = 0;
    }
    app.syncHeroVisibility();
    return;
  }

  app.state.selectedDocumentDetail = app.state.detailCache.get(documentId) ?? null;
  app.state.detailLoadError = false;
  app.render();
  if (app.elements.detailsPanel) {
    app.elements.detailsPanel.scrollTop = 0;
  }
  app.syncHeroVisibility();
  void loadSelectedDocumentDetail(app, documentId);
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

  const totalCount = getRegistryTotalCount(app);
  app.elements.documentCount.textContent = `${totalCount} items`;

  if (isRemoteRegistryEnabled(app)) {
    if (!totalCount && !app.state.registryLoading) {
      app.elements.documentList.innerHTML = `
        <div class="empty-state">
          <h3>No documents found</h3>
          <p>Adjust the filter or search query.</p>
        </div>
      `;
      return;
    }

    const itemHeight = getRegistryItemHeightEstimate(app);
    const { cardHeight, rowStride } = getRegistryMetrics(app);
    const renderWindow = {
      offset: getRegistryWindow(app).offset,
      limit: Math.min(getRegistryBatchSize(app), totalCount),
    };
    const renderEntries = getRegistryRenderEntries(app, renderWindow);
    const canvasHeight = Math.max(totalCount * rowStride - (totalCount > 0 ? rowStride - cardHeight : 0), 0);

    app.elements.documentList.innerHTML = `
      <div class="registry-virtual-canvas" style="height:${canvasHeight}px">
        ${renderEntries
          .map(({ index, document }) => {
            const top = index * rowStride;
            return `
              <div class="registry-virtual-row" style="top:${top}px;height:${cardHeight}px">
                ${
                  document
                    ? renderRegistryCard(document, document.id === app.state.selectedDocumentId)
                    : renderRegistrySkeletonCard()
                }
              </div>
            `;
          })
          .join("")}
      </div>
      ${app.state.registryLoading ? '<div class="registry-status">Loading more documents...</div>' : ""}
    `;

    app.elements.documentList.querySelectorAll("[data-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selectDocument(app, Number(button.dataset.id));
      });
    });
    return;
  }

  if (!filteredDocuments.length) {
    app.elements.documentList.innerHTML = `
      <div class="empty-state">
        <h3>No documents found</h3>
        <p>Adjust the filter or search query.</p>
      </div>
    `;
    return;
  }

  app.elements.documentList.innerHTML = `
    ${filteredDocuments
      .map((document) => renderRegistryCard(document, document.id === app.state.selectedDocumentId))
      .join("")}
  `;

  app.elements.documentList.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectDocument(app, Number(button.dataset.id));
    });
  });
}

function renderDetails(app, document) {
  if (!app.elements.details) return;

  if (app.state.selectedDocumentId === null) {
    app.elements.details.innerHTML = `
      <div class="empty-state">
        <h3>No document selected</h3>
        <p>Select a record from the registry on the left.</p>
      </div>
    `;
    return;
  }

  if (isRemoteRegistryEnabled(app) && app.state.detailLoading) {
    app.elements.details.innerHTML = `
      <div class="empty-state">
        <h3>Loading document</h3>
        <p>The full document is being requested from the API.</p>
      </div>
    `;
    return;
  }

  if (isRemoteRegistryEnabled(app) && app.state.detailLoadError) {
    app.elements.details.innerHTML = `
      <div class="empty-state">
        <h3>Document loading failed</h3>
        <p>Try selecting the document again.</p>
      </div>
    `;
    return;
  }

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
  app.elements.pageShell?.classList.toggle("hero-collapsed", false);
  app.elements.pageShell?.classList.toggle("hero-peek", false);
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

function scheduleRegistryViewportWork(app, { force = false } = {}) {
  if (!isRemoteRegistryEnabled(app)) return;

  const run = () => {
    app.state.registryScrollRafId = null;
    renderRegistryViewport(app);
    void app.loadRegistryPage({ force });
  };

  if (!app.win || typeof app.win.requestAnimationFrame !== "function") {
    run();
    return;
  }

  if (app.state.registryScrollRafId !== null) {
    return;
  }

  app.state.registryScrollRafId = app.win.requestAnimationFrame(run);
}

function bindEvents(app) {
  app.elements.searchInput?.addEventListener("input", (event) => {
    app.state.search = event.target.value;
    void app.refreshRegistry();
  });

  app.elements.typeFilter?.addEventListener("change", (event) => {
    app.state.typeId = event.target.value;
    void app.refreshRegistry();
  });

  app.elements.documentList?.addEventListener(
    "scroll",
    () => {
      handlePaneScroll(app, "registry");
      scheduleRegistryViewportWork(app);
    },
    {
      passive: true,
    }
  );
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

  app.win?.addEventListener(
    "resize",
    () => {
      scheduleRegistryViewportWork(app, { force: true });
    },
    { passive: true }
  );
}

function createApp({
  doc = globalThis.document,
  win = globalThis.window,
  fetchImpl = globalThis.fetch,
  apiBaseUrl = "",
  apiClient = createYrestApiClient
    ? createYrestApiClient({ fetchImpl, apiBaseUrl })
    : null,
} = {}) {
  const app = {
    doc,
    win,
    fetchImpl,
    apiBaseUrl,
    apiClient,
    docTypes,
    documents,
    state: createInitialState(),
    elements: createElements(doc),
    render() {
      const registryDocuments = getRegistryDocuments(app);
      ensureSelection(app, registryDocuments);
      renderStats(app);
      renderDocumentList(app, registryDocuments);
      renderDetails(app, getSelectedDocument(app));
      syncHeroVisibility(app);
    },
    renderStats() {
      renderStats(app);
    },
    loadHeroStats() {
      return loadHeroStats(app);
    },
    loadRegistryStats() {
      return loadRegistryStats(app);
    },
    loadRegistryPage(options) {
      return loadRegistryPage(app, options);
    },
    refreshRegistry() {
      return refreshRegistry(app);
    },
    selectDocument(documentId) {
      return selectDocument(app, documentId);
    },
    loadSelectedDocumentDetail(documentId) {
      return loadSelectedDocumentDetail(app, documentId);
    },
    buildRegistryPageRequest(options) {
      return buildRegistryPageRequest(app, options);
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
      if (app.apiClient) {
        void app.loadHeroStats();
      }
      void app.refreshRegistry();
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
    buildRegistryFilters,
    buildStatRequest,
    buildRegistryStatRequest,
    buildRegistryPageRequest,
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
  window.YrestDemoApp = createApp({
    doc: document,
    win: window,
    apiBaseUrl: resolveBrowserApiBaseUrl(window),
  }).init();
}
