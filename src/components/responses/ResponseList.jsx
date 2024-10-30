import React from 'react'
import ResponseCard from './ResponseCard'
import { useLocation } from 'react-router-dom'

function ResponseList() {
    const location = useLocation();
    
    console.log(location.state.responses);
  return (
    <div>
        <ResponseCard  />
    </div>
  )
}

export default ResponseList