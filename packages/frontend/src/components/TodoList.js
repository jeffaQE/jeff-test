import React from 'react';
import {
  List,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import TodoItem from './TodoItem';

const TodoList = ({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
}) => {
  return (
    <Paper elevation={1} sx={{ mt: 3 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" component="h2">
            Tasks
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="sort-by-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                value={sortBy}
                label="Sort By"
                onChange={(e) => onSortChange(e.target.value)}
                inputProps={{
                  'aria-label': 'Sort tasks by',
                }}
              >
                <MenuItem value="created_at">Date Created</MenuItem>
                <MenuItem value="due_date">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="sort-order-label">Order</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Order"
                onChange={(e) => onSortOrderChange(e.target.value)}
                inputProps={{
                  'aria-label': 'Sort order',
                }}
              >
                <MenuItem value="ASC">Ascending</MenuItem>
                <MenuItem value="DESC">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Box>

      {tasks.length > 0 ? (
        <List sx={{ p: 0 }}>
          {tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </List>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No tasks found. Add your first task to get started!
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default TodoList;
