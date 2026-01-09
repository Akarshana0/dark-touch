import React, { useState } from 'react';
import FormPage from './components/FormPage';
import PhotoUploadPage from './components/PhotoUploadPage';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    whatsappNumber: '',
    details: ''
  });
  const [photos, setPhotos] = useState([null, null, null, null]);

  const handleNextPage = (data) => {
    setFormData(data);
    setCurrentPage(2);
  };

  const handleBackPage = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {currentPage === 1 ? (
        <FormPage onNext={handleNextPage} initialData={formData} />
      ) : (
        <PhotoUploadPage 
          onBack={handleBackPage}
          formData={formData}
          photos={photos}
          setPhotos={setPhotos}
        />
      )}
    </div>
  );
}

export default App;