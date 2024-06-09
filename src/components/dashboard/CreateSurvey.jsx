import { Button } from "../../style"

function CreateSurvey({handlePortal}) {
  return (
    <>
        <Button onClick={() => handlePortal()}>Create Survey</Button>
    </>
  )
}

export default CreateSurvey