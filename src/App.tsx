import { useEffect, useState } from "react";
import CountriesPagination from "./components/countries-pagination";
import { Navbar } from "./components/Navbar";
import CountryDetail from "./components/CountryDetail";
import Flagged from "./pages/flagged";

// App component
function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const isCountry = path.startsWith("/country/");
  const isFlagged = path === "/flagged";
  const cca3 = isCountry ? decodeURIComponent(path.split("/")[2] || "") : null;

  // render component
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className="pt-16">
        {isCountry && cca3 ? (
          <CountryDetail cca3={cca3} />
        ) : isFlagged ? (
          <Flagged />
        ) : (
          <CountriesPagination />
        )}
      </main>
    </>
  );
}

export default App;
