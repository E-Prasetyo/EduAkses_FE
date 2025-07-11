import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Kursus", path: "/kursus" },
    { name: "Diskusi", path: "/diskusi" },
  ];

  return (
    <nav className="hidden md:flex items-start">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex h-[72px] px-5 items-center gap-1 transition-colors hover:bg-edu-white-grey ${
              isActive ? "bg-edu-white-grey" : ""
            }`}
          >
            <span
              className={`font-exo text-base font-semibold leading-tight capitalize transition-colors ${
                isActive
                  ? "text-edu-primary"
                  : "text-black hover:text-edu-primary"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
