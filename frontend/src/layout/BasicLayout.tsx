import { Outlet } from "react-router-dom";

export default function BasicLayout() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
