import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <ul>
            <li><Link to="/">Surveys</Link></li>
            <li><Link to="/deneme1">Responses</Link></li>
        </ul>
    </div>
  )
}

export default Navbar