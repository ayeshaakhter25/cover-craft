import { useState } from "react";
import axios from "axios";

function App() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState("");

  const generateLetter = async () => {
    const res = await axios.post("http://127.0.0.1:8000/generate", {
      resume: resume,
      job_description: jobDesc
    });
    setResult(res.data.cover_letter);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>CoverCraft</h2>

      <textarea
        placeholder="Paste Resume"
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        placeholder="Paste Job Description"
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <button onClick={generateLetter}>
        Generate Cover Letter
      </button>

      <pre>{result}</pre>
    </div>
  );
}

export default App;
