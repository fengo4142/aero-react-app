import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

import styles from './photoCarousel.module.scss';
import Clickable from '../clickable/Clickable';


const NextPhotoArrow = ({ className, onClick }) => (
  <Clickable
    className={`${className} ${styles.nextArrow}`}
    onClick={onClick}
  />
);

NextPhotoArrow.defaultProps = {
  className: '',
  onClick: () => {}
};

NextPhotoArrow.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};


const PrevPhotoArrow = ({ className, onClick }) => (
  <Clickable
    className={`${className} ${styles.prevArrow}`}
    onClick={onClick}
  />
);

PrevPhotoArrow.defaultProps = {
  className: '',
  onClick: () => {}
};

PrevPhotoArrow.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};


class PhotoCarousel extends Component {
  constructor(props) {
    super(props);
    this.mainCarousel = React.createRef();
    this.imageNav = React.createRef();
  }

  render() {
    const { photos, initialSlide } = this.props;
    if (photos.length === 1) {
      return (<img className={styles.singleImage} src={photos[0].image} alt="" />);
    }
    return (
      <>
        <div className={`${styles.mainCarousel} ${styles.centeredSlides}`}>
          <Slider
            asNavFor={this.imageNav.current}
            ref={this.mainCarousel}
            initialSlide={initialSlide}
            nextArrow={<NextPhotoArrow />}
            prevArrow={<PrevPhotoArrow />}
          >
            {photos.map(photo => (
              <div key={photo.id}>
                <img src={photo.image} alt={`work-order-${photo.id}`} />
              </div>
            ))}
          </Slider>
        </div>
        <div className={`${styles.imageNav}  ${styles.centeredSlides}`}>
          <Slider
            asNavFor={this.mainCarousel.current}
            ref={this.imageNav}
            slidesToShow={photos.length < 3 ? photos.length : 3}
            swipeToSlide
            focusOnSelect
            initialSlide={initialSlide}
            nextArrow={<NextPhotoArrow />}
            prevArrow={<PrevPhotoArrow />}
          >
            {photos.map(photo => (
              <div key={photo.id}>
                <img src={photo.image} alt={`work-order-small-${photo.id}`} />
              </div>
            ))}
          </Slider>
        </div>
      </>
    );
  }
}

PhotoCarousel.defaultProps = {
  initialSlide: 0
};

PhotoCarousel.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  initialSlide: PropTypes.number
};

export default PhotoCarousel;
