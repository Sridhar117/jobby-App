import './index.css'

const SalaryRange = props => {
  const {rangeDetails, filterSalaryRange} = props
  const {salaryRangeId, label} = rangeDetails

  const onSalaryChange = () => {
    filterSalaryRange(salaryRangeId)
  }

  return (
    <li className="list-item">
      <input
        onChange={onSalaryChange}
        type="radio"
        name="salary range"
        id={salaryRangeId}
        className="checkbox-el"
      />
      <label htmlFor={salaryRangeId} className="label-el">
        {label}
      </label>
    </li>
  )
}

export default SalaryRange
