import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props

    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <div>
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="mobile-menu">
        <li>
          <Link to="/">
            <AiFillHome />
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <BsFillBriefcaseFill />
          </Link>
        </li>
        <li>
          <button type="button" onClick={logout}>
            <FiLogOut />
          </button>
        </li>
      </ul>
      <ul className="desktop-menu">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/jobs">Jobs</Link>
        </li>
        <li>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
