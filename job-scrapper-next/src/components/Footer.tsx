const Footer = () => {
  return (
    <footer className="w-full py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Job Scrapper. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="/about" className="hover:text-pink-500 transition-colors">
              About
            </a>
            <a href="/contact" className="hover:text-pink-500 transition-colors">
              Contact
            </a>
            <a href="/privacy" className="hover:text-pink-500 transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
