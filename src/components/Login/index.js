import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  enterUsername = event => {
    this.setState({username: event.target.value})
  }

  enterPassword = event => {
    this.setState({password: event.target.value})
  }

  onFailureLogin = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLogin = async event => {
    event.preventDefault()
    const loginUrl = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    const {showError, errorMsg} = this.state
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg">
        <form className="form" onSubmit={this.onLogin}>
          <img
            className="website-logo-login"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <input
            onChange={this.enterUsername}
            type="text"
            id="username"
            className="input-el"
            placeholder="Username"
          />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            onChange={this.enterPassword}
            type="password"
            id="password"
            className="input-el"
            placeholder="Password"
          />
          <button type="submit" className="login-button">
            Login
          </button>
          {showError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
