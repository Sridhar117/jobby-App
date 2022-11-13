import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobCard = props => {
  const {similarJobDetails} = props
  const {
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,

    rating,
  } = similarJobDetails

  return (
    <li className="job-item">
      <div className="logo-title-rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div>
          <h1 className="job-title">{title}</h1>
          <div className="star-rating-container">
            <AiFillStar fill="#fbbf24" />
            <p className="company-rating">{rating}</p>
          </div>
        </div>
      </div>

      <h1 className="description-para">Description</h1>
      <p className="description-para">{jobDescription}</p>
      <div className="location-salary-container">
        <div className="location-type-container">
          <div className="icon-para-container">
            <MdLocationOn fill="white" />
            <p className="location-para">{location}</p>
          </div>
          <div className="icon-para-container">
            <BsFillBriefcaseFill fill="white" />
            <p className="location-para">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
