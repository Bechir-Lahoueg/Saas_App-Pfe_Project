import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} PlanifyGo. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
