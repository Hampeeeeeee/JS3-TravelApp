import CountriesPagination from "./components/countries-pagination"
import { Navbar } from "./components/Navbar"


function App() {
  
  return (
    <>
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
    <Navbar />
    <main className="p-20">
    <CountriesPagination />
    </main>
    </div>
    </>
  )

}

export default App
