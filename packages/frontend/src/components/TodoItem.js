import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

const TodoItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'default';
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'error';
    if (isToday(date)) return 'warning';
    if (isTomorrow(date)) return 'info';
    return 'default';
  };

  const getDueDateLabel = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    if (isToday(date)) return `Today (${format(date, 'MMM d')})`;
    if (isTomorrow(date)) return `Tomorrow (${format(date, 'MMM d')})`;
    if (isPast(date)) return `Overdue (${format(date, 'MMM d, yyyy')})`;
    return format(date, 'MMM d, yyyy');
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      1: 'High',
      2: 'Med-High',
      3: 'Medium',
      4: 'Med-Low',
      5: 'Low',
    };
    return labels[priority] || 'Medium';
  };

  const getPriorityColor = (priority) => {
    if (priority <= 2) return 'error';
    if (priority === 3) return 'warning';
    return 'default';
  };

  const dueDateLabel = getDueDateLabel(task.due_date);

  return (
    <ListItem
      sx={{
        backgroundColor: task.completed ? 'rgba(0, 0, 0, 0.03)' : 'transparent',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        '&:hover': {
          backgroundColor: 'rgba(0, 32, 91, 0.04)',
        },
      }}
      secondaryAction={
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            edge="end"
            aria-label={`Edit task: ${task.name}`}
            onClick={() => onEdit(task)}
            disabled={task.completed === 1}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            edge="end"
            aria-label={`Delete task: ${task.name}`}
            onClick={() => onDelete(task.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      }
    >
      <Checkbox
        checked={task.completed === 1}
        onChange={() => onToggleComplete(task.id)}
        inputProps={{
          'aria-label': `Mark task ${task.completed ? 'incomplete' : 'complete'}: ${task.name}`,
        }}
      />
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.name}
            </Typography>
            {dueDateLabel && (
              <Chip
                label={dueDateLabel}
                size="small"
                color={getDueDateColor(task.due_date)}
                sx={{ height: 24 }}
              />
            )}
            <Chip
              label={getPriorityLabel(task.priority)}
              size="small"
              variant="outlined"
              color={getPriorityColor(task.priority)}
              sx={{ height: 24 }}
            />
          </Box>
        }
        secondary={task.description}
        secondaryTypographyProps={{
          sx: {
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? 'text.disabled' : 'text.secondary',
          },
        }}
      />
    </ListItem>
  );
};

export default TodoItem;
