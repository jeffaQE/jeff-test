import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TodoForm = ({ open, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    due_date: initialData?.due_date ? new Date(initialData.due_date) : null,
    priority: initialData?.priority || 3,
  });

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      due_date: newDate,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      due_date: formData.due_date ? formData.due_date.toISOString().split('T')[0] : null,
    };
    
    onSubmit(submitData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      due_date: null,
      priority: 3,
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="todo-form-dialog-title"
    >
      <DialogTitle id="todo-form-dialog-title">
        {initialData ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              required
              label="Task Name"
              fullWidth
              value={formData.name}
              onChange={handleChange('name')}
              inputProps={{
                'aria-label': 'Task name',
                'aria-required': 'true',
              }}
            />
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              inputProps={{
                'aria-label': 'Task description',
              }}
            />
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={formData.due_date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: {
                      'aria-label': 'Due date',
                    },
                  },
                }}
              />
            </LocalizationProvider>
            
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={formData.priority}
                label="Priority"
                onChange={handleChange('priority')}
                inputProps={{
                  'aria-label': 'Task priority',
                }}
              >
                <MenuItem value={1}>High (1)</MenuItem>
                <MenuItem value={2}>Medium-High (2)</MenuItem>
                <MenuItem value={3}>Medium (3)</MenuItem>
                <MenuItem value={4}>Medium-Low (4)</MenuItem>
                <MenuItem value={5}>Low (5)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TodoForm;
