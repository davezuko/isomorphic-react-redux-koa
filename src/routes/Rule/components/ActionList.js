import React from 'react'
import ActionContainer from '../containers/ActionContainer'

export const ActionList = ({
  ruleId,
  actions={},
  addAction
}) => (
  <div>
    {
      Object.keys(actions).map(key => {
        return (<ActionContainer key={key} id={key} />)
      })
    }
    <button
      className='btn btn-default'
      onClick={e => {
        e.preventDefault()
        addAction(ruleId)
      }}
    >
      <div className='glyphicon glyphicon-plus' />
      <span> Add Action</span>
    </button>
  </div>
)

export default ActionList
