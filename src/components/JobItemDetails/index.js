import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: {},
    lifeAtCompany: {},
    skills: [],
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
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

      const updatedjobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      const updatedlifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      const updatedSkills = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const updatedSimilarJobs = data.similar_jobs.map(eachSimilarJob => ({
        companyLogoUrl: eachSimilarJob.company_logo_url,
        employmentType: eachSimilarJob.employment_type,
        id: eachSimilarJob.id,
        jobDescription: eachSimilarJob.job_description,
        location: eachSimilarJob.location,
        rating: eachSimilarJob.rating,
        title: eachSimilarJob.title,
      }))
      this.setState({
        jobDetails: updatedjobDetails,
        lifeAtCompany: updatedlifeAtCompany,
        skills: updatedSkills,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.getJobDetails}>
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state
    const {
      companyLogoUrl,
      title,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      employmentType,
      companyWebsiteUrl,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <div>
          <img src={companyLogoUrl} alt="job details company logo" />
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
            <a href={companyWebsiteUrl}>Visit</a>
            <h1>Description</h1>
            <p>{jobDescription}</p>
          </div>
          <div>
            <h1>Skills</h1>
            <ul>
              {skills.map(eachSkill => (
                <li key={eachSkill.name}>
                  <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                  <p>{eachSkill.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h1>Life at Company</h1>
            <div>
              <p>{description}</p>
              <img src={imageUrl} alt="life at company" />
            </div>
          </div>
        </div>
        <div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobs.map(eachSimilarJob => (
              <li key={eachSimilarJob.id}>
                <img
                  src={eachSimilarJob.companyLogoUrl}
                  alt="similar job company logo"
                />
                <div>
                  <h1>{eachSimilarJob.title}</h1>
                  <p>
                    <AiFillStar />
                    {eachSimilarJob.rating}
                  </p>
                </div>
                <div>
                  <h1>Description</h1>
                  <p>{eachSimilarJob.jobDescription}</p>
                </div>
                <div>
                  <p>
                    <HiLocationMarker />

                    {eachSimilarJob.location}
                  </p>
                  <p>
                    <BsFillBriefcaseFill />

                    {eachSimilarJob.employmentType}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  getJobView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
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

  render() {
    return (
      <div>
        <Header />
        <div>{this.getJobView()}</div>
      </div>
    )
  }
}

export default JobItemDetails
