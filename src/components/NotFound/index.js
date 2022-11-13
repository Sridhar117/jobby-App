import Header from '../Header'
import './index.css'

const NotFound = () => (
  <div className="">
    <Header />
    <div className="not-found-bg">
      <img
        className="not-found-image"
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1 className="job-failure-heading">Page Not Found</h1>
      <p className="job-failure-para">
        we&apos;re sorry, the page you requested could not be found.
      </p>
    </div>
  </div>
)

export default NotFound
