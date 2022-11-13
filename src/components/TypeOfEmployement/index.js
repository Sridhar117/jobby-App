import './index.css'

const TypeOfEmployment = props => {
  const {employmentDetails, filterEmploymentType} = props
  const {label, employmentTypeId} = employmentDetails

  const onEmploymentType = () => {
    console.log('Hello')
    console.log(employmentTypeId)
    filterEmploymentType(employmentTypeId)
  }

  return (
    <li className="list-item">
      <input
        type="checkbox"
        id={employmentTypeId}
        className="checkbox-el"
        onClick={onEmploymentType}
      />
      <label htmlFor={employmentTypeId} className="label-el">
        {label}
      </label>
    </li>
  )
}

export default TypeOfEmployment
