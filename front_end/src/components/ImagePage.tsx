
import React, { useEffect, useState } from 'react';
import { fetchAllImages } from '../api/vactions-api';
import VacationImages from './AllImages';

const VacationImagesPage: React.FC = () => {
  const [images, setImages] = useState<any[]>([]); // Update type according to your image data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchAllImages();
        console.log(fetchedImages); // Log the data to verify
        setImages(fetchedImages);
      } catch (err) {
        console.error(err); // Log error details
        setError('Failed to fetch images');
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {images.length > 0 ? (
        <VacationImages images={images} /> // Use the new component to display images
      ) : (
        <p>No images available.</p>
      )}
    </div>
  );
};

export default VacationImagesPage;
