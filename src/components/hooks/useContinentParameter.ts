// import { useCallback, useEffect, useState } from "react";

// export function useContinentParam() {
//   const read = () => {
//     const params = new URLSearchParams(window.location.search);
//     return params.get("continent") || "All";
//   };

//   const [continent, setContinentState] = useState<string>(read);

//   useEffect(() => {
//     const onPop = () => setContinentState(read());
//     window.addEventListener("popstate", onPop);
//     return () => window.removeEventListener("popstate", onPop);
//   }, []);

//   const setContinent = useCallback((c: string) => {
//     const params = new URLSearchParams(window.location.search);
//     if (!c || c === "All") {
//       params.delete("continent");
//     } else {
//       params.set("continent", c);
//     }

//     const qs = params.toString();
//     const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
//     window.history.pushState({}, "", newUrl);

//     // update this hook instance
//     setContinentState(c || "All");

//     // notify other hook instances (pushState doesn't trigger popstate)
//     window.dispatchEvent(new PopStateEvent("popstate"));
//   }, []);

//   return [continent, setContinent] as const;
// }