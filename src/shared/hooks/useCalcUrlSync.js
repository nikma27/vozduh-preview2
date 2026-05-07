import { useCallback, useEffect, useState } from "react";

const readCalcFromUrl = () => {
  const sp = new URLSearchParams(window.location.search);
  const open = sp.get("calc") === "1";
  const tab = sp.get("tab") === "ac" ? "ac" : "vent";
  return { open, tab };
};

const setUrlParams = (mutate, replace = true) => {
  const url = new URL(window.location.href);
  mutate(url.searchParams);
  const qs = url.searchParams.toString();
  const next = `${url.pathname}${qs ? `?${qs}` : ""}${url.hash}`;
  window.history[replace ? "replaceState" : "pushState"]({}, "", next);
};

export default function useCalcUrlSync() {
  const [{ open, tab }, setState] = useState(() => readCalcFromUrl());

  useEffect(() => {
    const onPop = () => setState(readCalcFromUrl());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openCalc = useCallback((requestedTab = "vent") => {
    const nextTab = requestedTab === "ac" ? "ac" : "vent";
    setState({ open: true, tab: nextTab });
    setUrlParams((sp) => {
      sp.set("calc", "1");
      sp.set("tab", nextTab);
    });
  }, []);

  const closeCalc = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    setUrlParams((sp) => {
      sp.delete("calc");
      sp.delete("tab");
    });
  }, []);

  return {
    calcOpen: open,
    calcTab: tab,
    openCalc,
    closeCalc,
  };
}
