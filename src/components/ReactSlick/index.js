import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import MovieBlogs from '../MovieBlogs/index'
import './index.css'

const ReactSlick = props => {
  const {moviesList} = props
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const renderSliders = () =>
    moviesList.map(eachMovie => (
      <MovieBlogs movieDetails={eachMovie} key={eachMovie.id} />
    ))

  return (
    <div className="slider-container">
      <ul className="slider-items">
        <Slider {...settings}>{renderSliders()}</Slider>
      </ul>
    </div>
  )
}

export default ReactSlick
