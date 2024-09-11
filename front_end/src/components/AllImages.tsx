import React from 'react';

interface VacationImagesProps {
  images: any[]; // Update type according to your image data
}

const VacationImages: React.FC<VacationImagesProps> = ({ images }) => {
  return (
    <div>
      {images.map((image, index) => (
        <img key={index} src={image.url} alt={`Vacation ${index}`} /> // Adjust as needed
      ))}
    </div>
  );
};

export default VacationImages;
