import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  const socialMediaLinks = [
    { href: "https://facebook.com", icon: "facebook-icon.png", alt: "Facebook" },
    { href: "https://twitter.com", icon: "twitter-icon.png", alt: "Twitter" },
    { href: "https://linkedin.com", icon: "linkedin-icon.png", alt: "LinkedIn" },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} SecureShare. All rights reserved.</p>
        <nav className="footer-links">
          <a href="/privacy-policy" aria-label="Privacy Policy">Privacy Policy</a>
          <a href="/terms-of-service" aria-label="Terms of Service">Terms of Service</a>
        </nav>
        <div className="social-media">
          {socialMediaLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.alt}
            >
              <img src={link.icon} alt={link.alt} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
