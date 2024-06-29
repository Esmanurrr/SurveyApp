import { Flex, InputRes } from '../../style'
import DeleteInput from './DeleteInput'

function ChoiceInput({onDelete, placeholder}) {

  return (
    <Flex style={{marginBottom: "1rem"}}>
        <InputRes type='text' placeholder={placeholder} />
        <DeleteInput onClick={onDelete} />
    </Flex>
  )
}

export default ChoiceInput