import React from "react";

const MenuItem = ({ 
  item, 
  isActive, 
  isSidebarExpanded, 
  isDarkMode, 
  onClick, 
  onMouseEnter, 
  onMouseLeave,
  hoveredMenu
}) => {
  const Icon = item.icon;
  const isHovered = hoveredMenu === item.id;

  return (
    <button
      className={`flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? isDarkMode
            ? "bg-blue-800/20 text-blue-400"
            : "bg-blue-50 text-blue-600"
          : isDarkMode
          ? "text-gray-300 hover:bg-slate-700/40"
          : "text-gray-600 hover:bg-gray-50"
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`flex items-center justify-center min-w-10 h-10 rounded-lg transition-all duration-200 ${
          isActive
            ? isDarkMode
              ? "bg-blue-900/30 text-blue-400"
              : "bg-blue-100 text-blue-600"
            : isDarkMode
            ? `text-gray-400 ${
                isHovered ? "bg-slate-700/40 text-gray-200" : ""
              }`
            : `text-gray-500 ${
                isHovered ? "bg-gray-100 text-gray-700" : ""
              }`
        }`}
      >
        <Icon size={20} />
      </div>

      {isSidebarExpanded && (
        <>
          <span
            className={`ml-3 ${
              isActive ? "font-medium" : ""
            } transition-all duration-200`}
          >
            {item.label}
          </span>

          {item.notification && (
            <div
              className={`ml-auto bg-blue-600 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center shadow-sm ${
                isActive || isHovered ? "scale-110" : ""
              } transition-all duration-200`}
            >
              {item.notification}
            </div>
          )}

          {item.enterprise && (
            <span
              className={`ml-auto text-xs py-0.5 px-2 rounded-lg border ${
                isDarkMode
                  ? "border-slate-600 text-slate-400"
                  : "border-gray-300 text-gray-500"
              } ${
                isActive || isHovered ? "scale-110" : ""
              } transition-all duration-200`}
            >
              ENT
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default React.memo(MenuItem);