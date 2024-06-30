import { useEffect, useState } from 'react'
import ChoiceInput from './ChoiceInput'
import { AddOptionsButton } from '../../style';

function Choices({options, setOptions}) {
  useEffect(() => {
    // Eğer options boşsa, varsayılan olarak 4 seçenek ekle
    if (options.length === 0) {
      setOptions(["", ""]);
    }
  }, [options, setOptions]);

  const handleRemoveInput = (indexToRemove) => {
    setOptions(options.filter((_, index) => index !== indexToRemove));
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  }

  const handleOptionsChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  return (
    <>
        {options.map((option,index) => (
                <ChoiceInput 
                    key={index}  
                    value={option}
                    onChange={(e) => handleOptionsChange(index, e.target.value)}
                    onDelete={() => handleRemoveInput(index)} 
                    placeholder={`Option ${index + 1}`}
                />
        ))}
        <AddOptionsButton type="button" onClick={handleAddOption}>Add option</AddOptionsButton>
    </> 
  )
}

export default Choices