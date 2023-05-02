import {Component} from 'react'
import Cookies from 'js-cookie'
import {format} from 'date-fns'

import Header from '../Header/index'
import Footer from '../Footer/index'
import MovieBlogs from '../MovieBlogs/index'
import Loading from '../Loading/index'
import FailureView from '../Failure/index'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  urlId: '',
}

class MovieItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    movieDetailsList: [],
    genresList: [],
    similarMoviesList: [],
    spokenLanguagesList: [],
  }

  componentDidMount() {
    this.getResponse()
    console.log('mountcall')
  }

  getResponse = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      // console.log(fetchedData)
      const updatedData = [fetchedData.movie_details].map(eachMovie => ({
        id: eachMovie.id,
        adult: eachMovie.adult,
        backdropPath: eachMovie.backdrop_path,
        budget: eachMovie.budget,
        title: eachMovie.title,
        overview: eachMovie.overview,
        releaseDate: eachMovie.release_date,
        ratingCount: eachMovie.vote_count,
        ratingAverage: eachMovie.vote_average,
        runtime: eachMovie.runtime,
        posterPath: eachMovie.poster_path,
      }))

      const genresData = fetchedData.movie_details.genres.map(eachGenre => ({
        id: eachGenre.id,
        name: eachGenre.name,
      }))

      const similarMoviesData = fetchedData.movie_details.similar_movies.map(
        eachSimilar => ({
          id: eachSimilar.id,
          posterPath: eachSimilar.poster_path,
          title: eachSimilar.title,
        }),
      )

      const spokenLanguagesData = fetchedData.movie_details.spoken_languages.map(
        eachLanguage => ({
          id: eachLanguage.id,
          language: eachLanguage.english_name,
        }),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        movieDetailsList: updatedData,
        genresList: genresData,
        similarMoviesList: similarMoviesData,
        spokenLanguagesList: spokenLanguagesData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getResponse()
  }

  onChangeResponse = () => {
    this.getResponse()
  }

  renderSuccessView = () => {
    const {
      movieDetailsList,
      similarMoviesList,
      genresList,
      spokenLanguagesList,
    } = this.state
    //  console.log(similarMoviesList)
    const {
      adult,
      backdropPath,
      budget,
      overview,
      releaseDate,
      runtime,
      title,
      ratingAverage,
      ratingCount,
      posterPath,
    } = {...movieDetailsList[0]}

    const movieType = adult ? 'A' : 'U/A'
    const hours = Math.floor(runtime / 60)
    const remainingMins = Math.floor(runtime % 60)
    const stringHour = hours > 9 ? `${hours}h` : `0${hours}h`
    const stringMins =
      remainingMins > 9 ? `${remainingMins}m` : `0${remainingMins}m`
    const date = format(new Date(releaseDate), 'Lo MM yyyy')
    return (
      <>
        <div
          style={{backgroundImage: `url(${backdropPath})`}}
          className="movie-item-card"
        >
          <Header />
          <div className="details-down">
            <h1 className="header-title">{title}</h1>
            <div className="row-cont">
              <p className="para">{`${stringHour} ${stringMins}`}</p>
              <p className="div">{movieType}</p>
              <p className="para">{format(new Date(releaseDate), 'yyyy')}</p>
            </div>
            <p className="description">{overview}</p>
            <button className="play-btn" type="button">
              Play
            </button>
          </div>
        </div>
        <div className="movie-details">
          <ul className="genres-un-list">
            <h1 className="genres-title">genres</h1>
            {genresList.map(each => (
              <li className="genres-list" key={each.id}>
                <p className="genres-description">{each.name}</p>
              </li>
            ))}
          </ul>

          <ul>
            <h1 className="genres-title">Audio Available</h1>
            {spokenLanguagesList.map(each => (
              <li key={each.id} className="genres-list">
                <p className="genres-description">{each.language}</p>
              </li>
            ))}
          </ul>
          <div className="rating-count">
            <div className="rating">
              <h1 className="genres-title">Rating Count</h1>
              <p className="genres-description">{ratingCount}</p>
            </div>
            <div>
              <h1 className="genres-title">Rating Average</h1>
              <p className="genres-description">{ratingAverage}</p>
            </div>
          </div>

          <div className="rating-count">
            <div className="rating">
              <h1 className="genres-title">Budget</h1>
              <p className="genres-description">{budget}</p>
            </div>
            <div>
              <h1 className="genres-title">Release Date</h1>
              <p className="genres-description">{date}</p>
            </div>
          </div>
        </div>
        <h1 className="more-like">More like this</h1>
        <ul className="popular-movies-list">
          {similarMoviesList.map(each => (
            <MovieBlogs
              movieDetails={each}
              key={each.id}
              onClick={this.onChangeResponse}
            />
          ))}
        </ul>
        <Footer />
      </>
    )
  }

  renderFailureView = () => (
    <div>
      <Header />
      <FailureView onClickRetry={this.onClickRetry} />
    </div>
  )

  renderLoadingView = () => (
    <div className="movie-items-loader">
      <Loading />
    </div>
  )

  renderMoviesItemView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {urlId} = this.setState
    console.log(urlId)
    return <div className="movie-item-cont">{this.renderMoviesItemView()}</div>
  }
}

export default MovieItemDetails
