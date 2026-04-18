import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Homepage.css';

import img1 from '../images/img1.jpg';
import img2 from '../images/img2.jpg';
import img3 from '../images/img3.jpg';
import img4 from '../images/img4.jpg';

const Homepage = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    cssEase: 'linear',
    pauseOnHover: false,
  };

  return (
    <div className="homepage">
      <Slider {...settings}>
        <div className="slide">
          <img src={img1} alt="Image 1" className="slide-img" />
          <div className="slide-text">Recipe Sharing Platform</div>
        </div>
        <div className="slide">
          <img src={img2} alt="Image 2" className="slide-img" />
          <div className="slide-text">Recipe Sharing Platform</div>
        </div>
        <div className="slide">
          <img src={img3} alt="Image 3" className="slide-img" />
          <div className="slide-text">Recipe Sharing Platform</div>
        </div>
        <div className="slide">
          <img src={img4} alt="Image 4" className="slide-img" />
          <div className="slide-text">Recipe Sharing Platform</div>
        </div>
      </Slider>
    </div>
  );
};

export default Homepage;
