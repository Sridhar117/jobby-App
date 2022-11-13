import {withRouter} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import TypeOfEmployment from '../TypeOfEmployement'
import SalaryRange from '../SalaryRange'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'Initial',
  inProgress: 'In Progress',
  failure: 'Failure',
  success: 'Success',
  zero: 'Zero',
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
    apiStatusProfile: apiStatusConstants.initial,
    apiStatusJobs: apiStatusConstants.initial,
    userProfile: {},
    jobsList: [],
    employmentType: [],
    minPackage: '',
    search: '',
  }

  componentDidMount() {
    this.getUserProfile()
    this.getJobs()
  }

  renderProfile = () => {
    const {apiStatusProfile, userProfile} = this.state

    const {profileImageUrl, name, shortBio} = userProfile

    switch (apiStatusProfile) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case apiStatusConstants.success:
        return (
          <div className="profile-success-container">
            <img src={profileImageUrl} alt="profile" className="profile-pic" />
            <h1 className="name">{name}</h1>
            <p className="short-bio">{shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="loader-container">
            <button
              type="button"
              className="profile-retry-button"
              onClick={this.onRetryProfile}
            >
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  onRetryProfile = () => {
    this.getUserProfile()
  }

  getJobs = async () => {
    this.setState({apiStatusJobs: apiStatusConstants.inProgress})
    const {employmentType, minPackage, search} = this.state
    const employmentTypeString = employmentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeString}&minimum_package=${minPackage}&search=${search}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobsUrl, options)
    if (response.ok === true) {
      const jobsData = await response.json()
      if (jobsData.jobs.length === 0) {
        this.setState({apiStatusJobs: apiStatusConstants.zero})
      } else {
        const updatedJobsList = jobsData.jobs.map(eachItem => ({
          id: eachItem.id,
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          title: eachItem.title,
        }))
        console.log(jobsData)
        console.log(updatedJobsList)
        this.setState({
          apiStatusJobs: apiStatusConstants.success,
          jobsList: updatedJobsList,
        })
      }
    } else {
      this.setState({apiStatusJobs: apiStatusConstants.failure})
    }
  }

  getUserProfile = async () => {
    this.setState({apiStatusProfile: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    if (response.ok === true) {
      const profileData = await response.json()

      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        apiStatusProfile: apiStatusConstants.success,
        userProfile: updatedProfileData,
      })
    } else {
      this.setState({apiStatusProfile: apiStatusConstants.failure})
    }
  }

  filterEmploymentType = employmentTypeId => {
    const {employmentType} = this.state
    if (employmentType.includes(employmentTypeId) === true) {
      this.setState(
        {
          employmentType: employmentType.filter(
            eachItem => eachItem !== employmentTypeId,
          ),
        },
        this.getJobs,
      )
    } else {
      this.setState(
        {
          employmentType: [...employmentType, employmentTypeId],
        },
        this.getJobs,
      )
    }
  }

  // const {employmentTypesList} = this.props
  renderTypeOfEmployment = () => (
    <div>
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-option-list">
        {employmentTypesList.map(eachItem => (
          <TypeOfEmployment
            key={eachItem.employmentTypeId}
            employmentDetails={eachItem}
            filterEmploymentType={this.filterEmploymentType}
          />
        ))}
      </ul>
    </div>
  )

  filterSalaryRange = salaryRangeId => {
    this.setState({minPackage: salaryRangeId}, this.getJobs)
  }

  //   const {salaryRangesList} = this.props
  renderSalaryRange = () => (
    <div>
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-option-list">
        {salaryRangesList.map(eachItem => (
          <SalaryRange
            key={eachItem.salaryRangeId}
            rangeDetails={eachItem}
            filterSalaryRange={this.filterSalaryRange}
          />
        ))}
      </ul>
    </div>
  )

  renderUI = () => (
    <>
      <div className="profile-section-container">
        <div className="search-container-sm">
          <input
            type="search"
            className="search-input"
            placeholder="Search"
            onChange={this.onSearchInput}
          />
          <button type="button" className="search-icon" onClick={this.onSearch}>
            <BsSearch fill="white" />
          </button>
        </div>
        {this.renderProfile()}
        <hr className="line" />
        {this.renderTypeOfEmployment()}
        <hr className="line" />
        {this.renderSalaryRange()}
      </div>
      <div className="jobs-section-container">
        <div className="search-container-lg">
          <input
            type="search"
            className="search-input"
            placeholder="Search"
            onChange={this.onSearchInput}
          />
          <button type="button" className="search-icon" onClick={this.onSearch}>
            <BsSearch fill="white" />
          </button>
        </div>
        {this.renderJobs()}
      </div>
    </>
  )

  onSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onSearch = () => {
    this.getJobs()
  }

  onRetryJob = () => {
    this.getJobs()
  }

  renderJobs = () => {
    const {apiStatusJobs, jobsList} = this.state

    switch (apiStatusJobs) {
      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container-jobs">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case apiStatusConstants.failure:
        return (
          <div className="jobs-failure-view-container">
            <img
              className="jobs-failure-view-image"
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1 className="job-failure-heading">Oops! Something Went Wrong</h1>
            <p className="job-failure-para">
              We cannot seem to find the page you are looking for
            </p>
            <button
              type="button"
              className="profile-retry-button"
              onClick={this.onRetryJob}
            >
              Retry
            </button>
          </div>
        )
      case apiStatusConstants.success:
        return (
          <ul className="jobs-list-container">
            {jobsList.map(eachItem => (
              <JobCard key={eachItem.id} jobsDetails={eachItem} />
            ))}
          </ul>
        )
      case apiStatusConstants.zero:
        return (
          <div className="jobs-failure-view-container">
            <img
              className="jobs-failure-view-image"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1 className="job-failure-heading">No Jobs Found</h1>
            <p className="job-failure-para">
              We could not find any jobs. Try other filters
            </p>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobs-bg">{this.renderUI()}</div>
      </div>
    )
  }
}

export default withRouter(Jobs)
