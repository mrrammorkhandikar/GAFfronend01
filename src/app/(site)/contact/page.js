'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, User, FileText } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 min-h-[320px] bg-cover bg-center" style={{ backgroundImage: "url('/images/helppoor.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-poppins uppercase text-sm font-semibold tracking-widest text-[#FFD700] mb-2">
              Get In Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Reach Out To Us
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto font-poppins">
              Have questions or want to learn more about our work? We'd love to hear from you. 
              Contact us using the form below or reach out through our contact information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-[#222222] mb-8 font-playfair">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-[#6D190D]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#222222] mb-1 font-poppins">Email</h3>
                    <p className="text-gray-600 font-poppins">guruuakanksha2019@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-[#6D190D]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#222222] mb-1 font-poppins">Phone</h3>
                    <p className="text-gray-600 font-poppins">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-[#6D190D]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#222222] mb-1 font-poppins">Address</h3>
                    <p className="text-gray-600 font-poppins">
                      Guru Akanksha Foundation<br />
                      Mumbai, Maharashtra<br />
                      India 400001
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-[#222222] mb-4 font-playfair">Office Hours</h3>
                <div className="space-y-2 text-gray-600 font-poppins">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#fcf9e3] rounded-xl p-8">
              <h2 className="text-3xl font-bold text-[#222222] mb-6 font-playfair">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Subject</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black"
                      placeholder="Subject of your message"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">Message *</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent font-poppins text-black resize-none"
                      placeholder="Your message..."
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#6D190D] text-white py-3 rounded-lg font-semibold hover:bg-[#8B2317] transition-colors font-poppins"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4 font-playfair">Find Us</h2>
            <p className="text-xl text-gray-600 font-poppins">
              Visit us at our office location
            </p>
          </div>
          
          {/* Placeholder for map */}
          <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-[#6D190D] mx-auto mb-4" />
              <p className="text-gray-600 font-poppins">Google Maps Integration</p>
              <p className="text-sm text-gray-500 font-poppins">Guru Akanksha Foundation Office Location</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;