import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { FileText, Menu, X } from "lucide-react";
import { useUser } from "./auth/UserContext";
import UserMenu from "./auth/UserMenu";
import AuthModal from "./auth/AuthModal";

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle = () => {} }: HeaderProps) => {
  const { user } = useUser();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openLoginModal = () => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab("signup");
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
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
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">CV Reviewer</h1>
        </div>

        {/* Center area - can be used for search or navigation in future */}
        <div className="hidden md:flex items-center space-x-6">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-blue-600"
            onClick={() => (window.location.href = "/")}
          >
            Home
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            How It Works
          </Button>
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-blue-600"
            onClick={() => (window.location.href = "/pricing")}
          >
            Pricing
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
            FAQ
          </Button>
        </div>

        {/* User profile or login */}
        <div className="flex items-center space-x-4">
          {user ? (
            <UserMenu />
          ) : (
            <div className="hidden md:flex space-x-2">
              <Button
                variant="outline"
                className="text-gray-700"
                onClick={openLoginModal}
              >
                Log In
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={openSignupModal}
              >
                Sign Up
              </Button>
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
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-blue-600"
              onClick={() => {
                window.location.href = "/";
                setMobileMenuOpen(false);
              }}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-blue-600"
              onClick={() => {
                window.location.href = "/pricing";
                setMobileMenuOpen(false);
              }}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Button>

            {!user && (
              <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-gray-700"
                  onClick={openLoginModal}
                >
                  Log In
                </Button>
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={openSignupModal}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </header>
  );
};

export default Header;
