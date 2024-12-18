import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ActionsPanel from "./components/ActionsPanel";
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
} from "@mui/material";

interface Action {
  id: number;
  option: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [results, setResults] = useState<string>(""); // Stores LLM response

  // Handle file upload
  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Add action
  const handleAddAction = () => {
    setActions((prevActions) => [
      ...prevActions,
      { id: Date.now(), option: "" },
    ]);
  };

  // Update action
  const handleActionChange = (id: number, newOption: string) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.id === id ? { ...action, option: newOption } : action
      )
    );
  };

  // Remove action
  const handleRemoveAction = (id: number) => {
    setActions((prevActions) =>
      prevActions.filter((action) => action.id !== id)
    );
  };

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    try {
      // Replace this with your access token obtained via `gcloud auth print-access-token`
      const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
      const ENDPOINT_ID = import.meta.env.VITE_ENDPOINT_ID;
      const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
      // Convert files to base64
      const base64Files = await Promise.all(files.map(fileToBase64));
  
      // Prepare the request payload
      const payload = {
        instances: base64Files.map((base64) => ({
          prompt: "<|image|><|begin_of_text|>Extract tex shown here.",
          multi_modal_data: { image: base64 }, // Send clean base64 string here
          max_tokens: 100,
        })),
      };
  
      console.log("Payload:", JSON.stringify(payload, null, 2));
  
      // Send POST request to Vertex AI endpoint
      const response = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`, // Use the token here
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      // Parse the response
      const data = await response.json();
      console.log("Response:", data);
      setResults(JSON.stringify(data.predictions, null, 2));
    } catch (error) {
      console.error("Error submitting data:", error);
      setResults("Error occurred during submission.");
    }
  };
  
  

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Modular Document Manager with LLM
      </Typography>

      <Grid container spacing={2}>
        {/* Left Pane */}
        <Grid item xs={6}>
          <FileUpload onUpload={handleFileUpload} />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleAddAction}>
              + Add Action
            </Button>
          </Box>
          <ActionsPanel
            actions={actions}
            onActionChange={handleActionChange}
            onRemoveAction={handleRemoveAction}
          />
          <Box mt={4}>
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Grid>

        {/* Right Pane */}
        <Grid item xs={6}>
          <Paper elevation={3} style={{ padding: "16px", minHeight: "400px" }}>
            <Typography variant="h6">LLM Response:</Typography>
            <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
              {results || "No results yet. Submit to see the response."}
            </pre>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
