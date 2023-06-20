import { useState } from 'react'
import { Modal } from 'react-bootstrap'

const Employee = ({ employee, onPatientSelect }) => {
  const [isExpanded, setIsExpand] = useState(false)

  const getFormValues = () => {
    const id = employee.empID
    const name = employee.firstName + ' ' + employee.lastName
    onPatientSelect({ id, name })
  }

  const bgclass = () => {
    if (localStorage.getItem('org')) {
      return `${localStorage.getItem('org')}`     
    }
    return "org-default"
}
  const expandedGrid = () => {
    return (
      <div className="grid-item">
        <div className="summary_head summary-block">
          {employee.firstName} {employee.lastName}
        </div>
        <div>
          <span className="summary_key">Employee ID: </span>
          <span className="summary_val"> {employee.empID} </span>
        </div>
        <div>
          <span className="summary_key">Role: </span>
          <span className="summary_val"> {employee.role} </span>
        </div>
        <div>
          <span className="summary_key">DOB: </span>
          <span className="summary_val"> {employee.dob} </span>
        </div>
        <div>
          <span className="summary_key">Mobile Numer: </span>
          <span className="summary_val"> {employee.mobile} </span>
        </div>
        <div>
          <span className="summary_key">Address: </span>
          <span className="summary_val"> {employee.address} </span>
        </div>
      </div>
    )
  }
  const collapsedGrid = () => {
    return (
      <div className="grid-item">
        <div className="summary_head">
          {employee.firstName} {employee.lastName}
        </div>
        <div>
          <span className="summary_key">Employee ID: </span>
          <span className="summary_val"> {employee.empID} </span>
        </div>
        <div className="grid-actions">
            <a href="javascript:void(0)" onClick={(e) => handleShowMoreClick()}>View more</a>
            <a href="javascript:void(0)" onClick={(e) => getFormValues()}>Show reports</a>
        </div>
      </div>
    )
  }
  const handleShowMoreClick = () => {
    setIsExpand(!isExpanded)
  }
  const closeModal = () => {
    setIsExpand(false)
  }
  return (
    <div className="grid-item">
      <div>{collapsedGrid()}</div>
      <Modal className="grid-modal" show={isExpanded} onHide={closeModal}>
        <Modal.Body className={bgclass()}>{expandedGrid()}</Modal.Body>
      </Modal>
    </div>
  )
}

export default Employee
