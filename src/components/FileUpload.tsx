import React from 'react';
import { Box, Button } from '@mui/material';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files);
    }
  };

  return (
    <Box>
      <input
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button variant="outlined" component="span">
          Upload Files
        </Button>
      </label>
    </Box>
  );
};

export default FileUpload;
