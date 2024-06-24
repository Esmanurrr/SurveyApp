import React, { useState } from 'react'
import ChoiceInput from './ChoiceInput'

function Choices() {
    const [showInput, setShowInput] = useState(true);

    const handleRemoveInput = () => {
        setShowInput(false);
    }

  return (
    <>
        {showInput && <ChoiceInput onDelete={handleRemoveInput}/>}
        {showInput && <ChoiceInput onDelete={handleRemoveInput}/>}
        {showInput && <ChoiceInput onDelete={handleRemoveInput}/>}
        {showInput && <ChoiceInput onDelete={handleRemoveInput}/>}

    </>
  )
}

export default Choices