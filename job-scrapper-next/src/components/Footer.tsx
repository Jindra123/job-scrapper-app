const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="row-start-6 flex gap-6 flex-wrap items-center justify-center">
      <p>All rights reserved ©{currentYear}</p>
    </footer>
  );
};

export default Footer;
