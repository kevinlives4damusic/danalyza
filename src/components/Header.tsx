import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { FileText, Menu, X, LogOut, User } from "lucide-react";
import { useUser } from "./auth/UserContext";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle = () => {} }: HeaderProps) => {
  const { user, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuToggle();
  };

  return (
    <header className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">CV Reviewer</h1>
          </Link>
        </div>

        {/* Center area - can be used for search or navigation in future */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Button>
          </Link>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            How It Works
          </Button>
          <Link to="/pricing">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-blue-600"
            >
              Pricing
            </Button>
          </Link>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            FAQ
          </Button>
        </div>

        {/* User profile or login */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex space-x-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  className="text-gray-700"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-md z-40">
          <div className="flex flex-col p-4 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-blue-600"
              >
                Home
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Button>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-700 hover:text-blue-600"
              >
                Pricing
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Button>

            {user ? (
              <Button
                variant="outline"
                className="w-full text-gray-700"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                Log Out
              </Button>
            ) : (
              <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full text-gray-700"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
