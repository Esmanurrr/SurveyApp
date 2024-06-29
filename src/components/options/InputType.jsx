import React, { useState } from 'react'
import { Dropdown } from '../../style'

function InputType({setInputType}) {

  const handleInputType = (e) => {
    setInputType(e.target.value);
  }

  return (
    <>
    <Dropdown onChange={handleInputType} style={{width:"30%"}}>
        <option value="Email">Email</option>
        <option value="Text">Text</option>
    </Dropdown>
    </>
  )
}

export default InputType