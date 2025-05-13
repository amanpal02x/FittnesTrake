import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${({ theme }) => theme.bg_secondary};
`;

const CarouselSlide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.active ? '1' : '0')};
  transition: opacity 0.5s ease-in-out;
  background: ${({ theme }) => theme.bg_secondary};
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.loaded ? '1' : '0'};
  transition: opacity 0.3s ease-in-out;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bg_secondary};
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const CarouselButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  z-index: 2;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  ${props => props.position === 'left' ? 'left: 20px;' : 'right: 20px;'}
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
`;

const Dot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: white;
  }
`;

const Carousel = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageError = (index) => {
    console.error(`Failed to load image at index ${index}`);
    setLoadedImages(prev => ({ ...prev, [index]: false }));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <CarouselContainer>
      {images.map((image, index) => (
        <CarouselSlide key={index} active={index === currentIndex}>
          <CarouselImage
            src={image.url}
            alt={image.alt}
            loaded={loadedImages[index]}
            onLoad={() => handleImageLoad(index)}
            onError={() => handleImageError(index)}
          />
          {!loadedImages[index] && (
            <LoadingOverlay>Loading image...</LoadingOverlay>
          )}
        </CarouselSlide>
      ))}
      <CarouselButton position="left" onClick={handlePrevious}>
        <ChevronLeft />
      </CarouselButton>
      <CarouselButton position="right" onClick={handleNext}>
        <ChevronRight />
      </CarouselButton>
      <CarouselDots>
        {images.map((_, index) => (
          <Dot
            key={index}
            active={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </CarouselDots>
    </CarouselContainer>
  );
};

export default Carousel; 