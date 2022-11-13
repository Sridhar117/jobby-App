import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <img
          className="header-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="nav-options-list">
        <li>
          <Link to="/">
            <AiFillHome fill="white" size="20" />
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <BsFillBriefcaseFill fill="white" size="20" />
          </Link>
        </li>
        <li>
          <button type="button" className="logout-button" onClick={onLogout}>
            <FiLogOut size="20" />
          </button>
        </li>
      </ul>
      <ul className="nav-items-lg">
        <li className="para">
          <Link to="/" className="link-item">
            <p>Home</p>
          </Link>
        </li>
        <li className="para">
          <Link to="/jobs" className="link-item">
            <p>Jobs</p>
          </Link>
        </li>
      </ul>
      <div className="logout-button-lg-container">
        <button type="button" className="logout-btn-lg" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
