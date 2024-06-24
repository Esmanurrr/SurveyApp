import { Flex, Input } from '../../style'
import DeleteInput from './DeleteInput'

function ChoiceInput({onDelete, index}) {

  return (
    <Flex style={{marginBottom: "1rem"}}>
        <Input type='text' placeholder={`Option ${index + 1}`} />
        <DeleteInput onClick={() => onDelete(index)} />
    </Flex>
  )
}

export default ChoiceInput