import { Input } from "@/components/ui/input"

const InputField = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:top-auto md:left-auto md:translate-x-0 md:translate-y-0">
    <div className="w-full max-w-xs bg-primary/50 rounded-md hover:scale-[1.05] transition-transform items-center">
      <Input placeholder="Search..." />
    </div>
    </div>
  )
}

export default InputField;
