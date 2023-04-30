import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrorMsg: false, ErrorMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = ErrorMsg => {
    this.setState({showErrorMsg: true, ErrorMsg})
  }

  onSubmitUserDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {showErrorMsg, ErrorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-page">
        <img
          src="https://res.cloudinary.com/dbbpvtoge/image/upload/v1681828712/Group_7399_qkyzvz.png"
          alt="login website logo"
          className="movie-logo"
        />
        <div className="form-cont">
          <form className="login-form" onSubmit={this.onSubmitUserDetails}>
            <h1 className="login-text">Login</h1>
            <div className="user-input-cont">
              <label htmlFor="username" className="label-text">
                USERNAME
              </label>
              <br />
              <input
                type="text"
                id="username"
                value={username}
                className="input-user"
                onChange={this.onChangeUsername}
              />
            </div>

            <div className="user-input-cont">
              <label htmlFor="password" className="label-text">
                PASSWORD
              </label>
              <br />
              <input
                type="password"
                value={password}
                id="password"
                className="input-user"
                onChange={this.onChangePassword}
              />
            </div>
            {showErrorMsg && <p className="error-msg">{ErrorMsg}</p>}
            <div className="login-btn-cont">
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
