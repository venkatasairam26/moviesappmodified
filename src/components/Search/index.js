import {Component} from 'react'
import Cookies from 'js-cookie'

import Header from '../Header/index'
import MovieBlogs from '../MovieBlogs/index'
import Loading from '../Loading'
import FailureView from '../Failure/index'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const inputBox = true
class Search extends Component {
  state = {
    searchValue: '',
    moviesSearchResult: [],
    apiStatus: apiStatusConstants.initial,
  }

  getSearchResponse = async searchText => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchText}`
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
      const fetchedSearchMoviesData = fetchedData.results.map(eachMovie => ({
        backdropPath: eachMovie.backdrop_path,
        id: eachMovie.id,
        posterPath: eachMovie.poster_path,
        title: eachMovie.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        moviesSearchResult: fetchedSearchMoviesData,
        searchValue: searchText,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNoResultsView = () => {
    const {searchValue} = this.state

    return (
      <div className="no-result-container">
        <img
          className="no-img"
          alt="no movies"
          src="https://res.cloudinary.com/dkbxi5qts/image/upload/v1660153718/movies%20prime%20app/No_Views_awtv8d.svg"
        />
        <p className="search-value">
          Your search for {searchValue} did not find any matches.
        </p>
      </div>
    )
  }

  renderSearchRoute = () => {
    const {moviesSearchResult} = this.state
    console.log(moviesSearchResult)
    return moviesSearchResult.length > 0 ? (
      <ul className="popular-movies-list">
        {moviesSearchResult.map(eachMovie => (
          <MovieBlogs movieDetails={eachMovie} key={eachMovie.id} />
        ))}
      </ul>
    ) : (
      this.renderNoResultsView()
    )
  }

  onClickRetry = () => {
    this.getSearchResponse()
  }

  renderLoadingView = () => (
    <div className="popular-loading">
      <Loading />
    </div>
  )

  renderSearchPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSearchRoute()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return <FailureView onClickRetry={this.onClickRetry} />

      default:
        return null
    }
  }

  render() {
    return (
      <div className="search-cont">
        <Header
          inputBox={inputBox}
          getSearchFromHeader={this.getSearchResponse}
        />
        {this.renderSearchPage()}
      </div>
    )
  }
}

export default Search
