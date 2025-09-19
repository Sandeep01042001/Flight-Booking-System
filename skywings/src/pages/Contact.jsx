import React, { useState } from 'react';
import Button from '../components/ui/buttons/Button';
import Input from '../components/ui/forms/Input';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="bg-white">
      {/* Hero banner */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1920&auto=format&fit=crop"
          alt="Airplane taking off"
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold">Contact Skywings</h1>
            <p className="mt-2 text-indigo-100 max-w-2xl mx-auto">We’re here to help with bookings, support, and partnerships.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="max-w-2xl lg:max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-500 text-center">
            Have questions? We're here to help. Fill out the form below and our team will get back to you as soon as possible.
          </p>
          {/* Quick contact cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500">Call us</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">+1 (555) 123-4567</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500">Email</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">support@skywings.com</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center shadow-sm">
              <div className="text-sm text-gray-500">Partnerships</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">partner@skywings.com</div>
            </div>
          </div>
          
          {submitStatus === 'success' && (
            <div className="mt-8 p-4 bg-green-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Subject"
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 relative left-1/2 right-1/2 -mx-[50vw] w-screen py-8 sm:py-10">
          {/* Subtle top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500/60 via-indigo-400/40 to-indigo-500/60" />
          <div className="max-w-5xl mx-auto text-center px-4">
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Contact Center</h3>
            <p className="mt-1 text-sm text-gray-500">We’re here to help. Reach us via phone, email, or visit our offices.</p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-gray-200">
              {/* Column 1: Customer Support */}
              <div className="px-6">
                <h4 className="text-base font-medium text-gray-900">Customer Support</h4>
                <dl className="mt-4 space-y-3">
                  <div>
                    <dt className="sr-only">Phone number</dt>
                    <dd className="flex items-center justify-center">
                      <svg className="flex-shrink-0 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href="tel:+15551234567" className="ml-3 text-base text-indigo-600 hover:text-indigo-700">+1 (555) 123-4567</a>
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd className="flex items-center justify-center">
                      <svg className="flex-shrink-0 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href="mailto:support@skywings.com" className="ml-3 text-base text-indigo-600 hover:text-indigo-700">support@skywings.com</a>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Column 2: New York */}
              <div className="px-6">
                <h4 className="text-base font-medium text-gray-900 inline-flex items-center justify-center">
                  {/* location pin icon */}
                  <svg className="h-4 w-4 text-indigo-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  New York
                </h4>
                <address className="mt-3 not-italic text-base text-gray-600 leading-relaxed">
                  123 Aviation Way<br />
                  New York, NY 10001<br />
                  United States
                </address>
              </div>

              {/* Column 3: London */}
              <div className="px-6">
                <h4 className="text-base font-medium text-gray-900 inline-flex items-center justify-center">
                  {/* location pin icon */}
                  <svg className="h-4 w-4 text-indigo-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  London
                </h4>
                <address className="mt-3 not-italic text-base text-gray-600 leading-relaxed">
                  456 Skyline Road<br />
                  London, EC1A 1BB<br />
                  United Kingdom
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
