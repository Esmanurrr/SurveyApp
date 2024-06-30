import { Flex, InputRes } from '../../style'
import DeleteInput from './DeleteInput'

function ChoiceInput({value, onChange, onDelete, placeholder}) {

  return (
    <Flex style={{marginBottom: "1rem"}}>
        <InputRes type='text' value={value} onChange={onChange} placeholder={placeholder} />
        <DeleteInput onClick={onDelete} />
    </Flex>
  )
}

export default ChoiceInput