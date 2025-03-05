import React from 'react';
import { Carousel } from 'react-bootstrap';

import firstImage from '../assets/img/carrusel_1.webp';
import secondImage from '../assets/img/carrusel_2.webp';
import thirdImage from '../assets/img/carrusel_3.webp';

interface CarouselImageProps {
  src: string;
  alt: string;
  caption?: string;
}

const CarouselImage: React.FC<CarouselImageProps> = ({ src, alt, caption }) => {
  return (
    <figure>
      <img
        className="d-block w-100"
        src={src}
        alt={alt}
        loading="lazy"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};

const CarouselExample: React.FC = () => {
  return (
    <section aria-label="Carrusel de imágenes destacadas">
      <Carousel>
        <Carousel.Item>
          <CarouselImage 
            src={firstImage} 
            alt="Imagen destacada 1: Enfermera con los dedos hacia arriba, señal de que todo está bien" 
            caption="Mujer enfermera" 
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImage 
            src={secondImage} 
            alt="Imagen destacada 2: Mujer científica con un tubo de ensayo" 
            caption="Mujer científica" 
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselImage 
            src={thirdImage} 
            alt="Imagen destacada 3: Implementos médicos" 
            caption="Implementos médicos" 
          />
        </Carousel.Item>
      </Carousel>
    </section>
  );
};

export default CarouselExample;
