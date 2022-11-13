import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill, BsSearch} from 'react-icons/bs'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobs: [],
    jobsProfileStatus: apiStatusConstants.initial,
    employmentType: [],
    minimumPackage: '',
    search: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobs()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfileObject = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileObject,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    const {employmentType, minimumPackage, search} = this.state
    this.setState({jobsProfileStatus: apiStatusConstants.inProgress})
    const employmentTypeWithCommaSepartedString = employmentType.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeWithCommaSepartedString}&minimum_package=${minimumPackage}&search=${search}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobs = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobs: updatedJobs,
        jobsProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobsProfileStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  changeSalarayRange = minimumSalary => {
    this.setState({minimumPackage: minimumSalary}, this.getJobs)
  }

  changeEmployeementType = employmentTypeId => {
    const {employmentType} = this.state
    if (employmentType.includes(employmentTypeId) === true) {
      this.setState(
        {
          employmentType: employmentType.filter(
            eachType => eachType !== employmentTypeId,
          ),
        },
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, employmentTypeId],
        }),
        this.getJobs,
      )
    }
  }

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobs} = this.state

    if (jobs.length === 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }
    return (
      <ul>
        {jobs.map(eachJob => {
          const {
            companyLogoUrl,
            title,
            jobDescription,
            location,
            packagePerAnnum,
            rating,
            id,
            employmentType,
          } = eachJob
          return (
            <li key={id}>
              <Link to={`/jobs/${id}`}>
                <img src={companyLogoUrl} alt="company logo" />
                <div>
                  <h1>{title}</h1>
                  <p>
                    <AiFillStar />
                    {rating}
                  </p>
                </div>
                <div>
                  <p>
                    <HiLocationMarker />
                    {location}
                  </p>
                  <p>
                    <BsFillBriefcaseFill />
                    {employmentType}
                  </p>
                  <p>{packagePerAnnum}</p>
                </div>
                <hr />
                <div>
                  <h1>Description</h1>
                  <p>{jobDescription}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  getJobView = () => {
    const {jobsProfileStatus} = this.state
    switch (jobsProfileStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div>
      <button type="button" onClick={this.getProfileDetails}>
        Retry
      </button>
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {profileImageUrl, name, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  getProfileView = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    const {search} = this.state
    return (
      <div>
        <Header />
        <div>
          <input
            type="search"
            value={search}
            placeholder="Search"
            onChange={this.changeSearchInput}
          />
          <button type="button" onClick={this.getJobs} testid="searchButton">
            <BsSearch />
          </button>
        </div>
        {this.getProfileView()}
        <hr />
        <div>
          <h1>Type of Employment</h1>
          <ul>
            {employmentTypesList.map(eachEmployeeType => (
              <li key={eachEmployeeType.employmentTypeId}>
                <input
                  type="checkbox"
                  id={eachEmployeeType.employmentTypeId}
                  onChange={() =>
                    this.changeEmployeementType(
                      eachEmployeeType.employmentTypeId,
                    )
                  }
                />
                <label htmlFor={eachEmployeeType.employmentTypeId}>
                  {eachEmployeeType.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <div>
          <h1>Salary Range</h1>
          <ul>
            {salaryRangesList.map(eachSalaryRange => (
              <li key={eachSalaryRange.salaryRangeId}>
                <input
                  type="radio"
                  id={eachSalaryRange.salaryRangeId}
                  name="salary"
                  onChange={() =>
                    this.changeSalarayRange(eachSalaryRange.salaryRangeId)
                  }
                />
                <label htmlFor={eachSalaryRange.salaryRangeId}>
                  {eachSalaryRange.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div>{this.getJobView()}</div>
      </div>
    )
  }
}

export default Jobs
