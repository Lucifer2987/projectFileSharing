import React, { useState } from "react";

function SocialLink({ href, src, alt }) {
  return (
    <a href={href} aria-label={alt} target="_blank" rel="noopener noreferrer">
      <img src={src} alt={alt} />
    </a>
  );
}

function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage("Please fill out all fields.");
      return;
    }

    // Simulate form submission
    setStatusMessage("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });

    // Here, you can integrate the backend API to send messages
  };

  return (
    <section className="contacts" id="contact">
      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Contact Us</h2>
          <p>Have questions? Get in touch with us!</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
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
            <SocialLink
              href="https://facebook.com"
              src="facebook-icon.png"
              alt="Facebook"
            />
            <SocialLink
              href="https://twitter.com"
              src="twitter-icon.png"
              alt="Twitter"
            />
            <SocialLink
              href="https://linkedin.com"
              src="linkedin-icon.png"
              alt="LinkedIn"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contacts;
