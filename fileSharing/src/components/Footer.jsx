import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer>
      <p>&copy; {currentYear} SecureShare. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
