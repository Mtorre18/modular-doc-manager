import React from 'react';
import { Box, Typography, MenuItem, Select, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Action {
  id: number;
  option: string;
}

interface ActionsPanelProps {
  actions: Action[];
  onActionChange: (id: number, option: string) => void;
  onRemoveAction: (id: number) => void;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  actions,
  onActionChange,
  onRemoveAction,
}) => {
  const actionOptions = [
    'Parse to JSON',
    'Parse to Excel',
    'API Call using JSON Parsed',
  ];

  return (
    <Box mt={2}>
      {actions.map((action) => (
        <Box
          key={action.id}
          mb={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box flex={1} mr={2}>
            <Typography variant="body1">Action:</Typography>
            <Select
              fullWidth
              value={action.option}
              onChange={(e) => onActionChange(action.id, e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select an action
              </MenuItem>
              {actionOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <IconButton
            color="error"
            aria-label="remove action"
            onClick={() => onRemoveAction(action.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export default ActionsPanel;
