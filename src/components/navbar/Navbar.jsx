import React from 'react'
import { Link } from 'react-router-dom'
import { NavbarWrapper } from '../../style'

const Navbar = () => {
  return (
    <NavbarWrapper>
        <ul>
            <li><Link to="/">Surveys</Link></li>
            <li><Link to="/responses">Responses</Link></li>
        </ul>
    </NavbarWrapper>
  )
}

export default Navbar