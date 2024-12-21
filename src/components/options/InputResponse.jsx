import { useState } from 'react'
import Input from './Input'
import InputType from './InputType'
import { Flex } from '../../style'

const InputResponse = ({inputType = "Text", setInputType}) => {

  return (
    <Flex>
        <Input type={inputType} placeholder={`Enter ${inputType}`}/>
        <InputType inputType={inputType} setInputType={setInputType}/>
    </Flex>
  )
}

export default InputResponse