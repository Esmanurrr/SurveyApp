import { Button } from "../../style"

function CreateSurvey({handlePortal}) {
  return (
    <div style={{textAlign: "center"}}>
        <Button onClick={() => handlePortal()}>Create Survey</Button>
    </div>
  )
}

export default CreateSurvey