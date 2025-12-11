const Footer = () => {
  return (
    <footer className="w-full py-8 mt-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-sm text-text-light dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} NextJobs. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="/about" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="/contact" className="hover:text-primary transition-colors">
              Contact
            </a>
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
