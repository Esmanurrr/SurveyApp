import React, { useState } from 'react'
import { Dropdown } from '../../style'

function InputType({inputType, setInputType}) {

  const handleInputType = (e) => {
    setInputType(e.target.value);
  }

  return (
    <Dropdown onChange={handleInputType} value={inputType} style={{width:"30%"}}>
        <option value="Email">Email</option>
        <option value="Text">Text</option>
    </Dropdown>
  )
}

export default InputType