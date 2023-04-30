import {Component} from 'react'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import {GiHamburgerMenu} from 'react-icons/gi'
import {AiFillCloseCircle} from 'react-icons/ai'

import './index.css'

class Header extends Component {
  state = {searchValue: '', menu: false}

  getSearchValue = event => {
    this.setState({searchValue: event.target.value})
  }

  sendSearchValue = () => {
    const {getSearchFromHeader} = this.props
    const {searchValue} = this.state
    if (searchValue !== '') {
      getSearchFromHeader(searchValue)
    }
  }

  onChangeMenu = () => {
    this.setState(prevState => ({menu: !prevState.menu}))
  }

  onMenuDetails = () => (
    <ul className="mobile-menu-details">
      <Link to="/" className="text">
        <li className="mobile-text">Home</li>
      </Link>
      <Link to="/popular" className="text">
        <li className="mobile-text">Popular</li>
      </Link>
      <Link to="/account" className="text">
        <li className="account">Account</li>
      </Link>
      <button type="button" className="close-btn" onClick={this.onChangeMenu}>
        <AiFillCloseCircle className="close-icon" />
      </button>
    </ul>
  )

  render() {
    const {inputBox} = this.props
    const {menu} = this.state
    console.log(menu)
    return (
      <div>
        <nav className="nav-bar">
          <div className="logo-ul-cont">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dbbpvtoge/image/upload/v1681828712/Group_7399_qkyzvz.png"
                alt="website logo"
                className="header-movie-logo"
              />
            </Link>

            <ul className="ul-link">
              <Link to="/" className="route-link">
                <li className="route-text">Home</li>
              </Link>
              <Link to="/popular" className="route-link">
                <li className="nav-text">Popular</li>
              </Link>
              <Link to="/account" className="route-link">
                <li className="account">Account</li>
              </Link>
            </ul>
          </div>
          <div className="search-user">
            {inputBox ? (
              <input type="search" onChange={this.getSearchValue} />
            ) : null}
            <div>
              <Link to="/search">
                <button
                  type="button"
                  onClick={this.sendSearchValue}
                  testid="searchButton"
                  className="search-btn"
                >
                  <HiOutlineSearch className="search-icon" />
                </button>
              </Link>
              <button
                type="button"
                className="menu-btn"
                onClick={this.onChangeMenu}
              >
                <GiHamburgerMenu className="menu" />
              </button>
            </div>

            <Link to="/account">
              <img
                src="https://res.cloudinary.com/dbbpvtoge/image/upload/v1681891464/Group_i62eoo.png"
                alt="profile"
                className="avatar"
              />
            </Link>
          </div>
        </nav>
        {menu && this.onMenuDetails()}
      </div>
    )
  }
}

export default Header
