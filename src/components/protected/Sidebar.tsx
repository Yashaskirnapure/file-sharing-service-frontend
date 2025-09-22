import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/useAuth";

const Sidebar = ({ active, setActive }: { active: string; setActive: (v: string) => void }) => {
  const items = ["Upload", "My Files", "Downloads"];
  const { user, logout } = useAuth();

  return (
    <div className="w-60 h-screen bg-gray-100 border-r p-4 space-y-2">
      <p className="text-sm text-gray-600">Hello, {user?.name}</p>
      {items.map((item) => (
        <Button
          key={item}
          variant={active === item ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActive(item)}
        >
          {item}
        </Button>
      ))}
      <Button
        variant="outline"
        className="w-full justify-start mt-4 text-red-600 border-red-300 hover:bg-red-50"
        onClick={logout}
      >
        Sign Out
      </Button>
    </div>
  )
}

export default Sidebar