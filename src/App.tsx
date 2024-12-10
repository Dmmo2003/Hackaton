import { useState } from 'react'
import './App.css'
import ParticiantForm from "./ParticipantForm";
import StepperSelector from "./StepperSelector"

function App() {
  const [FormSelected, setFormSelected] = useState<string>("");

  return (
    <>
      <h1>Create Verifiable Credential</h1>

      {FormSelected === "" && (
        <StepperSelector FormSelected={FormSelected} setFormSelected={setFormSelected} />
      )}
      {FormSelected === "Participant" && (
        <ParticiantForm FormSelected={FormSelected} setFormSelected={setFormSelected}/>
      )}
      {FormSelected === "Service Offering" && (
        <ParticiantForm FormSelected={FormSelected} setFormSelected={setFormSelected}/>
      )}
    </>
  );
}

export default App;