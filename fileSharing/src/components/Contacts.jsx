import React from "react";

function Contacts() {
  return (
    <section className="contacts" id="contact">
      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Contact Us</h2>
          <p>Have questions? Get in touch with us!</p>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Company Details */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            <strong>Email:</strong> support@secureshare.com
          </p>
          <p>
            <strong>Phone:</strong> +1-234-567-890
          </p>
          <p>
            <strong>Address:</strong> 123 SecureShare Lane, Tech City
          </p>

          {/* Social Media Links */}
          <div className="social-links">
            <a href="#">
              <img src="facebook-icon.png" alt="Facebook" />
            </a>
            <a href="#">
              <img src="twitter-icon.png" alt="Twitter" />
            </a>
            <a href="#">
              <img src="linkedin-icon.png" alt="LinkedIn" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
