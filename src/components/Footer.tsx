import React from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Mail, Github, Linkedin } from "lucide-react";

type FooterProps = {
  className?: string;
};

const Footer = ({ className }: FooterProps = {}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "w-full bg-gray-100 py-4 px-6 border-t border-gray-200",
        className,
      )}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          © {currentYear} CV Reviewer. All rights reserved.
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="/privacy"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/help"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Help Center
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="mailto:contact@cvreviewer.com"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Email us"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/cvreviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/company/cvreviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
