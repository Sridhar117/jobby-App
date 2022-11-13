import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="home-container">
    <Header />
    <div>
      <h1>Find The Job That Fits Your Life</h1>
      <p>
        Millions of people are searching for jobs, salary , information ,
        company reviews. Find the job that fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  </div>
)

export default Home
