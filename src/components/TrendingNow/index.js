import {Component} from 'react'
import Cookies from 'js-cookie'

import Loading from '../Loading'
import FailureView from '../Failure/index'
import ReactSlick from '../ReactSlick/index'

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
    }
  }

  renderSuccessView = () => {
    const {trendingMoviesList} = this.state
    return <ReactSlick moviesList={trendingMoviesList} />
  }

  renderTrendingMovies = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return <Loading />
      case apiStatusConstants.failure:
        return <FailureView />

      default:
        return null
    }
  }

  render() {
    return <div>{this.renderTrendingMovies()}</div>
  }
}

export default TrendingNow
