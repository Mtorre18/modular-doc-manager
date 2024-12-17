import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ActionsPanel from './components/ActionsPanel';
import { Container, Typography, Box, Button } from '@mui/material';

interface Action {
  id: number;
  option: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const handleFileUpload = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleAddAction = () => {
    setActions((prevActions) => [
      ...prevActions,
      { id: Date.now(), option: '' },
    ]);
  };

  const handleActionChange = (id: number, newOption: string) => {
    setActions((prevActions) =>
      prevActions.map((action) =>
        action.id === id ? { ...action, option: newOption } : action
      )
    );
  };

  const handleRemoveAction = (id: number) => {
    setActions((prevActions) => prevActions.filter((action) => action.id !== id));
  };

  const handleSubmit = () => {
    console.log("Uploaded Files:", files);
    console.log("Selected Actions:", actions);
    alert("Data Submitted! Check the console for output.");
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Modular Document Manager
      </Typography>

      {/* File Upload Component */}
      <FileUpload onUpload={handleFileUpload} />

      {/* Add Action Button */}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleAddAction}>
          + Add Action
        </Button>
      </Box>

      {/* Actions Panel */}
      <ActionsPanel
        actions={actions}
        onActionChange={handleActionChange}
        onRemoveAction={handleRemoveAction}
      />

      {/* Submit Button */}
      <Box mt={4} textAlign="center">
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      {/* Debugging Output */}
      <Box mt={4}>
        <Typography variant="h6">Uploaded Files:</Typography>
        {files.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
      </Box>
    </Container>
  );
};

export default App;
