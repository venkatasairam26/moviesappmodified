import {Component} from 'react'
import Cookies from 'js-cookie'

import MovieBlogs from '../MovieBlogs/index'
import Header from '../Header/index'
import Footer from '../Footer'
import Loading from '../Loading/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {apiStatus: apiStatusConstants.initial, popularMovies: {}}

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = ' https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      //  console.log(data)
      const updatedData = data.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        popularMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderSuccessView = () => {
    const {popularMovies} = this.state
    return (
      <ul className="popular-movies-list">
        {popularMovies.map(eachMovie => (
          <MovieBlogs movieDetails={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    )
  }

  renderPopularMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return <Loading />

      default:
        return null
    }
  }

  render() {
    return (
      <div className="popular-page">
        <Header />
        {this.renderPopularMovies()}
        <Footer />
      </div>
    )
  }
}

export default Popular
