import {Component} from 'react'
import Cookies from 'js-cookie'

import Loading from '../Loading'
import ReactSlick from '../ReactSlick/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TrendingNow extends Component {
  state = {trendingMoviesList: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getResponse()
  }

  getResponse = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      //   console.log(fetchedData)
      const updatedData = fetchedData.results.map(eachMovie => ({
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        trendingMoviesList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {trendingMoviesList} = this.state
    return <ReactSlick moviesList={trendingMoviesList} />
  }

  renderLoadingView = () => (
    <div className="t-loading">
      <Loading />
    </div>
  )

  onClickRetry = () => {
    this.getResponse()
  }

  renderFailureView = () => (
    <div className="failure-cont-original">
      <img
        src="https://res.cloudinary.com/wavelabs/image/upload/v1682926686/alert-triangle_rkopzd.png"
        alt="failure view"
        className="failure-logo-org"
      />
      <p className="failure-msg-org">Something went wrong. Please try again</p>
      <button
        className="failure-btn-org"
        type="button"
        onClick={this.onClickRetry}
      >
        Try Again
      </button>
    </div>
  )

  renderTrendingMovies = () => {
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
    return <div>{this.renderTrendingMovies()}</div>
  }
}

export default TrendingNow
