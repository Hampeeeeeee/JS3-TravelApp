import CountriesPagination from "./components/countries-pagination";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main className="pt-16">
        <CountriesPagination />
      </main>
    </>
  );
}

export default App;
