import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import JobSpecificCard from '../JobSpecificCard'
import './index.css'

const apiStatusConstants = {
  initial: 'Initial',
  inProgress: 'In Progress',
  failure: 'Failure',
  success: 'Success',
}

class JobItemDetails extends Component {
  state = {
    apiStatusJobSpecific: apiStatusConstants.initial,
    jobSpecificDetails: {},
  }

  componentDidMount() {
    this.getJobSpecificData()
  }

  getJobSpecificData = async () => {
    this.setState({apiStatusJobSpecific: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const jobSpecificUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobSpecificUrl, options)

    if (response.ok === true) {
      const jobSpecificData = await response.json()
      console.log(jobSpecificData)
      const updatedJobData = {
        jobDetails: {
          companyLogoUrl: jobSpecificData.job_details.company_logo_url,
          companyWebsiteUrl: jobSpecificData.job_details.company_website_url,
          employmentType: jobSpecificData.job_details.employment_type,
          id: jobSpecificData.job_details.id,
          jobDescription: jobSpecificData.job_details.job_description,
          lifeAtCompany: {
            description:
              jobSpecificData.job_details.life_at_company.description,
            imageUrl: jobSpecificData.job_details.life_at_company.image_url,
          },
          location: jobSpecificData.job_details.location,
          packagePerAnnum: jobSpecificData.job_details.package_per_annum,
          rating: jobSpecificData.job_details.rating,
          title: jobSpecificData.job_details.title,
          skills: jobSpecificData.job_details.skills.map(eachItem => ({
            name: eachItem.name,
            imageUrl: eachItem.image_url,
          })),
        },
        similarJobs: jobSpecificData.similar_jobs.map(eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          location: eachItem.location,
          title: eachItem.title,
          rating: eachItem.rating,
        })),
      }
      this.setState({
        jobSpecificDetails: updatedJobData,
        apiStatusJobSpecific: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatusJobSpecific: apiStatusConstants.failure})
    }
  }

  onRetryJob = () => {
    this.getJobSpecificData()
  }

  renderJobSpecificUi = () => {
    const {apiStatusJobSpecific, jobSpecificDetails} = this.state

    switch (apiStatusJobSpecific) {
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
        return <JobSpecificCard jobSpecificDetails={jobSpecificDetails} />
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div>
          <Header />
        </div>
        <div className="jobs-bg-specific">{this.renderJobSpecificUi()}</div>
      </>
    )
  }
}

export default JobItemDetails
