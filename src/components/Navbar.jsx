import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const hideDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      hideDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="py-2 px-2 bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 flex justify-between items-center">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 text-shadow">My GameList</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="mr-4 bg-blue-600 text-white font-bold py-2 px-4 rounded transition-transform hover:transform hover:-translate-y-1"
          >
            Menu
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <Link to="/games" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={hideDropdown}>
                Game List
              </Link>
              <Link to="/users" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={hideDropdown}>
                User List
              </Link>
              <Link to="/developers" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={hideDropdown}>
                Developer List
              </Link>
              <Link to="/genres" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={hideDropdown}>
                Genre List
              </Link>
              <Link to="/publishers" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={hideDropdown}>
                Publisher List
              </Link>
              <Link to="/ratings" className="block px-4 py-2 text-gray-200 hover:bg-gray-700" onClick={hideDropdown}>
                Rating List
              </Link>
              <button
                className="block w-full text-center px-4 py-2 text-red-500 hover:bg-gray-700"
                onClick={() => {
                  handleLogout();
                  hideDropdown();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
