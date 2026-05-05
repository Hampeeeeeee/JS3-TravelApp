import { Input } from "@/components/ui/input"
import { useUrlParams } from "./hooks/useUrlParams";
import { useEffect, useState } from "react";

// InputField component
const InputField = () => {
  const [params, setParams] = useUrlParams();
  const [q, setQ] = useState(params.query ?? "");

  // Sync local state with URL params
  useEffect(() => {
      setQ(params.query ?? "");
  }, [params.query]);

  // Debounce updating URL params
  useEffect(() => {
  const timer = setTimeout(() => {
    if (q !== params.query) {  // only update if query actually changed
      setParams({ query: q });
    }
  }, 400);
  return () => clearTimeout(timer);
}, [q, setParams, params.query]);

  // render component
  return (
    <div>
    <div className="w-full max-w-xs bg-primary/50 rounded-md hover:scale-[1.05] transition-transform items-center">
      <Input placeholder="Search..." 
       value={q}
       onChange={(e) => setQ((e.target as HTMLInputElement).value)}
       aria-label="Search countries"/>
    </div>
    </div>
  )
}

export default InputField;
