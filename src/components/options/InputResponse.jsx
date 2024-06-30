import { useState } from 'react'
import Input from './Input'
import InputType from './InputType'
import { Flex } from '../../style'

const InputResponse = ({inputType, setInputType}) => {

  return (
    <Flex>
        <Input type={inputType} placeholder={`Enter ${inputType}`}/>
        <InputType setInputType={setInputType}/>
    </Flex>
  )
}

export default InputResponse