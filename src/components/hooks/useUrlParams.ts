import { useCallback, useEffect, useState } from "react";
import type { UrlParams } from "../types/UrlParams";

const DEFAULTS: UrlParams = { page: 1, pageSize: 14, query: "", region: undefined };

function readParams(): UrlParams {
  const p = new URLSearchParams(window.location.search);
  const rawPage = Number(p.get("page") ?? DEFAULTS.page);
  const rawPageSize = Number(p.get("pageSize") ?? DEFAULTS.pageSize);
  return {
    page: Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : DEFAULTS.page,
    pageSize: Number.isFinite(rawPageSize) && rawPageSize > 0 ? Math.floor(rawPageSize) : DEFAULTS.pageSize,
    query: p.get("query") ?? DEFAULTS.query,
    region: p.get("region") ?? DEFAULTS.region,
  };
}

export function useUrlParams() {
  const [params, setParamsState] = useState<UrlParams>(readParams);

  useEffect(() => {
    const onPop = () => setParamsState(readParams());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const setParams = useCallback((updates: Partial<UrlParams>) => {
    const p = new URLSearchParams(window.location.search);

    // page
    if (updates.page !== undefined) {
      p.set("page", String(Math.max(1, Math.floor(updates.page))));
    }

    // pageSize
    if (updates.pageSize !== undefined) {
      const ps = Math.max(1, Math.floor(updates.pageSize));
      p.set("pageSize", String(ps));
      // changing pageSize usually resets page to 1 unless page explicitly provided
      if (updates.page === undefined) p.set("page", "1");
    }

    // query
    if (updates.query !== undefined) {
      if (updates.query === "" || updates.query == null) p.delete("query");
      else p.set("query", updates.query);
      // search changes -> reset to first page if page not explicitly provided
      if (updates.page === undefined) p.set("page", "1");
    }

    // region (continent)
    if (updates.region !== undefined) {
      if (!updates.region || updates.region === "All") {
        p.delete("region");
      } else {
        p.set("region", updates.region);
      }
      // region changes -> reset to first page if page not explicitly provided
      if (updates.page === undefined) p.set("page", "1");
    }

    const qs = p.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.pushState({}, "", newUrl);

    // update this hook instance and notify others
    setParamsState(readParams());
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return [params, setParams] as const;
}