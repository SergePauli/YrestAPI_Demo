(function (root, factory) {
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
    return;
  }

  root.YrestApiClient = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function createFactory() {
  function buildPresetPageRequest({
    model,
    preset,
    offset = 0,
    limit = 20,
    filters = {},
  }) {
    return {
      model,
      preset,
      offset,
      limit,
      filters,
    };
  }

  function buildStatsRequest({ model, filters = {}, aggregates }) {
    return {
      model,
      filters,
      aggregates,
    };
  }

  function buildPresetItemRequest({ model, preset, id, filters = {} }) {
    return buildPresetPageRequest({
      model,
      preset,
      offset: 0,
      limit: 1,
      filters: {
        id__eq: id,
        ...filters,
      },
    });
  }

  function createYrestApiClient({
    fetchImpl = globalThis.fetch,
    apiBaseUrl = "",
  } = {}) {
    async function postJson(path, payload) {
      const response = await fetchImpl(`${apiBaseUrl}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response?.ok) {
        throw new Error(`HTTP ${response?.status ?? "unknown"}`);
      }

      return response.json();
    }

    return {
      fetchPresetPage(options) {
        return postJson("/api/index", buildPresetPageRequest(options));
      },
      async fetchPresetItem(options) {
        const payload = await postJson("/api/index", buildPresetItemRequest(options));
        if (Array.isArray(payload?.items)) return payload.items[0] ?? null;
        if (Array.isArray(payload?.data)) return payload.data[0] ?? null;
        if (Array.isArray(payload)) return payload[0] ?? null;
        return null;
      },
      fetchStats(options) {
        return postJson("/api/stats", buildStatsRequest(options));
      },
    };
  }

  return {
    buildPresetItemRequest,
    buildPresetPageRequest,
    buildStatsRequest,
    createYrestApiClient,
  };
});
