import { LuSquareMenu } from "react-icons/lu";

const Topbar = ({ collapsed, setCollapsed }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer"
      >
        <LuSquareMenu className="text-4xl" />
      </button>

      <div className="text-sm font-medium text-gray-700">
         Halo, <span className="font-semibold">{user?.name}</span>
      </div>
    </div>
  );
};

export default Topbar;
