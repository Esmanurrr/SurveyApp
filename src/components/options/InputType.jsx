import React from 'react'
import { Dropdown } from '../../style'

function InputType({email, text}) {
  return (
    <>
    <Dropdown>
        <option value={email}>Email</option>
        <option value={text}>Text</option>
    </Dropdown>
    </>
  )
}

export default InputType