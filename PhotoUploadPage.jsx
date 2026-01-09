import React, { useState } from 'react';
import axios from 'axios';

const PhotoUploadPage = ({ onBack, formData, photos, setPhotos }) => {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[index] = {
          file: file,
          preview: reader.result,
          name: file.name
        };
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSubmit = async () => {
    setUploading(true);
    setError('');

    try {
      // Prepare form data
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('nickname', formData.nickname || '');
      submitData.append('whatsappNumber', formData.whatsappNumber);
      submitData.append('details', formData.details || '');

      // Add photos
      photos.forEach((photo, index) => {
        if (photo && photo.file) {
          submitData.append('photos', photo.file);
        }
      });

      // Send to backend
      const response = await axios.post('/api/submit-application', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          // Reset form
          window.location.reload();
        }, 3000);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const isSubmitDisabled = photos.every(photo => photo === null);
  const uploadedCount = photos.filter(photo => photo !== null).length;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-400">
              Your application has been automatically sent to WhatsApp!
            </p>
          </div>
          <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 mb-6">
            <p className="text-green-300 text-sm">
              ✓ Details submitted<br />
              ✓ Photos uploaded<br />
              ✓ WhatsApp message sent<br />
              ✓ Application complete!
            </p>
          </div>
          <p className="text-gray-500 text-sm">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-slide-in">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-pulse-slow">
              DARK TOUCH
            </h1>
            <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full mt-2"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Upload Your Photos
          </h2>
          <p className="text-gray-400 text-lg">Step 2 of 2 - Photo Submission</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-800/50 rounded-lg p-4">
              <p className="text-red-300 text-sm">⚠️ {error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Photo {index + 1} {index === 0 && <span className="text-gray-500">(Required)</span>}
                </label>

                <div className="relative">
                  {photos[index] ? (
                    <div className="relative group">
                      <img
                        src={photos[index].preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg border-2 border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-200 rounded-lg flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ✓ Uploaded
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-900/30 hover:bg-gray-900/50 transition duration-200">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-12 h-12 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={(e) => handlePhotoChange(index, e)}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          {uploadedCount > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-4 mb-6 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium">Upload Progress</span>
                <span className="text-purple-400 font-semibold">{uploadedCount} / 4 photos</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadedCount / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              disabled={uploading}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitDisabled || uploading}
              className={`flex-1 font-semibold py-4 px-6 rounded-lg shadow-lg transform transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                isSubmitDisabled || uploading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white hover:scale-[1.02] active:scale-[0.98] focus:ring-purple-500'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending to WhatsApp...
                </span>
              ) : 'Submit Application →'}
            </button>
          </div>

          {isSubmitDisabled && (
            <p className="text-center text-yellow-500 mt-4 text-sm">
              ⚠️ Please upload at least one photo to continue
            </p>
          )}
        </div>

        <div className="mt-6 bg-purple-900/20 border border-purple-800/50 rounded-lg p-4">
          <p className="text-purple-300 text-sm text-center">
            🤖 Your application will be automatically sent to WhatsApp. No manual action required!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploadPage;