import {Component} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header/index'
import Footer from '../Footer/index'
import Loading from '../Loading/index'
import FailureView from '../Failure/index'
import TrendingNow from '../TrendingNow/index'
import Originals from '../Originals/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {trendingMoviesList: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getTrendingMovies()
  }

  getTrendingMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.results.map(eachMovie => ({
        id: eachMovie.id,
        backdropPath: eachMovie.backdrop_path,
        title: eachMovie.title,
        overview: eachMovie.overview,
        posterPath: eachMovie.poster_path,
      }))
      const RandomNum = Math.floor(Math.random() * fetchedData.length)
      console.log(fetchedData[RandomNum])
      this.setState({
        trendingMoviesList: fetchedData[RandomNum],
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {trendingMoviesList} = this.state
    const {backdropPath, title, overview} = trendingMoviesList
    return (
      <div>
        <div
          className="home-poster"
          style={{backgroundImage: `url(${backdropPath})`}}
        >
          <Header />
          <div className="home-movie-details">
            <h1 className="movie-title">{title}</h1>
            <h1 className="movie-overview">{overview}</h1>
            <button type="button" className="paly-btn">
              Play
            </button>
          </div>
        </div>
        <div className="originals-trend-cont">
          <div>
            <h1 className="trending-now">Trending Now</h1>
            <TrendingNow />
          </div>

          <div>
            <h1 className="trending-now">Originals </h1>
            <Originals />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  renderInProgressView = () => (
    <div>
      <Header />
      <Loading testid="loader" />
    </div>
  )

  onClickRetry = () => {
    console.log('retry clicked')
    this.getTrendingMovies()
  }

  renderFailureView = () => <FailureView onClickRetry={this.onClickRetry} />

  renderHomePage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="home-cont">{this.renderHomePage()}</div>
      </>
    )
  }
}
export default Home
