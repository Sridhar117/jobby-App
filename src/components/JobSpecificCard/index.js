import {RiExternalLinkLine} from 'react-icons/ri'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const JobSpecificCard = props => {
  const {jobSpecificDetails} = props
  const {jobDetails, similarJobs} = jobSpecificDetails
  console.log(jobDetails)
  console.log(jobSpecificDetails)

  const {
    companyWebsiteUrl,
    title,
    skills,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    lifeAtCompany,
  } = jobDetails

  return (
    <>
      <div className="job-specific-item">
        <div className="logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo-specific"
          />
          <div>
            <h1 className="job-title-specific">{title}</h1>
            <div className="star-rating-container">
              <AiFillStar fill="#fbbf24" className="star-icon" />
              <p className="company-rating-specific">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-salary-container">
          <div className="location-type-container">
            <div className="icon-para-container">
              <MdLocationOn fill="white" className="location-icon" />
              <p className="location-para-specific">{location}</p>
            </div>
            <div className="icon-para-container">
              <BsFillBriefcaseFill fill="white" className="location-icon" />
              <p className="location-para-specific">{employmentType}</p>
            </div>
          </div>
          <p className="company-package-specific">{packagePerAnnum}</p>
        </div>
        <hr className="line-specific" />
        <div className="link-description-container">
          <h1 className="description-heading-specific">Description</h1>
          <a href={companyWebsiteUrl} target="_parent" className="anchor-link">
            Visit <RiExternalLinkLine />
          </a>
        </div>
        <p className="description-para-specific">{jobDescription}</p>
        <h1 className="description-heading-specific">Skills</h1>
        <ul className="skills-container">
          {skills.map(eachItem => (
            <li key={eachItem.name} className="skill-item">
              <img
                src={eachItem.imageUrl}
                alt={eachItem.name}
                className="skill-image"
              />
              <p className="skill-para">{eachItem.name}</p>
            </li>
          ))}
        </ul>
        <h1 className="description-heading-specific">Life at Company</h1>
        <div className="life-at-company-container">
          <div className="life-para-container">
            <p className="description-para-specific">
              {lifeAtCompany.description}
            </p>
          </div>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
      </div>
      <h1 className="similar-job-heading">Similar Jobs</h1>
      <ul className="similar-job-container">
        {similarJobs.map(eachItem => (
          <SimilarJobCard key={eachItem.id} similarJobDetails={eachItem} />
        ))}
      </ul>
    </>
  )
}

export default JobSpecificCard
