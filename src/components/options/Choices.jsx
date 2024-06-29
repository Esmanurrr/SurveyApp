import { useState } from 'react'
import ChoiceInput from './ChoiceInput'
import { AddOptionsButton } from '../../style';

function Choices() {
  const [options, setOptions] = useState([0, 1, 2, 3]);

  const handleRemoveInput = (indexToRemove) => {
    setOptions(options.filter((index) => index !== indexToRemove));
  };

  const handleAddOption = () => {
    setOptions([...options, options.length]);
  }

  return (
    <>
        {options.map((option,index) => (
                <ChoiceInput 
                    key={option}  
                    onDelete={() => handleRemoveInput(option)} 
                    placeholder={`Option ${index + 1}`}
                />
        ))}
        <AddOptionsButton type="button" onClick={handleAddOption}>Add option</AddOptionsButton>
    </> 
  )
}

export default Choices