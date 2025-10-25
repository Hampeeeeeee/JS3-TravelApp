import { Input } from "@/components/ui/input"
import { useUrlParams } from "./hooks/useUrlParams";
import { useEffect, useState } from "react";

const InputField = () => {
  const [params, setParams] = useUrlParams();
  const [q, setQ] = useState(params.query ?? "");

  useEffect(() => {
      setQ(params.query ?? "");
  }, [params.query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams({ query: q });
    }, 400);
    return () => clearTimeout(timer);
  }, [q, setParams]);


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
