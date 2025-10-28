import { useEffect, useState } from "react";
import CountriesPagination from "./components/countries-pagination";
import { Navbar } from "./components/Navbar";
import CountryDetail from "./components/CountryDetail";

// App component
function App() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // simple router: /country/:cca3 -> CountryDetail, otherwise list page
  const isCountry = path.startsWith("/country/");
  const cca3 = isCountry ? decodeURIComponent(path.split("/")[2] || "") : null;

  // render component
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className="pt-16">
        {isCountry && cca3 ? <CountryDetail cca3={cca3} /> : <CountriesPagination />}
      </main>
    </>
  );
}

export default App;
