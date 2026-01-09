import React, { useState } from 'react';

const FormPage = ({ onNext, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^[0-9+\s\-()]+$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-pulse-slow">
              DARK TOUCH
            </h1>
            <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full mt-2"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Join Our Team
          </h2>
          <p className="text-gray-400 text-lg">Step 1 of 2 - Personal Information</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900/50 border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900/50 border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-300">
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                placeholder="Enter your nickname (optional)"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-300">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900/50 border ${
                  errors.whatsappNumber ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200`}
                placeholder="+94 71 234 5678"
              />
              {errors.whatsappNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.whatsappNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="details" className="block text-sm font-medium text-gray-300">
                Additional Details
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 resize-none"
                placeholder="Tell us about yourself, your experience, and why you want to join..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Next Step →
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          All fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </div>
  );
};

export default FormPage;