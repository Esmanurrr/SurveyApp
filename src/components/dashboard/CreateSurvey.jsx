import { Button } from "../../style"

function CreateSurvey({handlePortal}) {
  return (
    <div style={{textAlign: "center", marginRight: "1rem"}}>
        <Button onClick={() => handlePortal()}>Create Survey</Button>
    </div>
  )
}

export default CreateSurvey