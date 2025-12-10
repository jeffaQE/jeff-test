import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from '../components/TodoItem';

describe('TodoItem Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleComplete = jest.fn();

  const baseTask = {
    id: 1,
    name: 'Test Task',
    description: 'Test Description',
    due_date: null,
    priority: 3,
    completed: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task information', () => {
    render(
      <TodoItem
        task={baseTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        task={baseTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const editButton = screen.getByLabelText(/edit task/i);
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(baseTask);
  });

  it('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        task={baseTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const deleteButton = screen.getByLabelText(/delete task/i);
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(baseTask.id);
  });

  it('should call onToggleComplete when checkbox clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoItem
        task={baseTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnToggleComplete).toHaveBeenCalledWith(baseTask.id);
  });

  it('should display completed task with line-through', () => {
    const completedTask = { ...baseTask, completed: 1 };

    render(
      <TodoItem
        task={completedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const taskName = screen.getByText('Test Task');
    expect(taskName).toHaveStyle({ textDecoration: 'line-through' });
  });

  it('should disable edit button for completed tasks', () => {
    const completedTask = { ...baseTask, completed: 1 };

    render(
      <TodoItem
        task={completedTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const editButton = screen.getByLabelText(/edit task/i);
    expect(editButton).toBeDisabled();
  });

  it('should display due date chip when due date exists', () => {
    const taskWithDueDate = { ...baseTask, due_date: '2025-12-10' };

    render(
      <TodoItem
        task={taskWithDueDate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    // Check that the year 2025 appears in the rendered component (in the due date chip)
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it('should display priority chip', () => {
    const highPriorityTask = { ...baseTask, priority: 1 };

    render(
      <TodoItem
        task={highPriorityTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should have accessible labels for screen readers', () => {
    render(
      <TodoItem
        task={baseTask}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
      />
    );

    expect(screen.getByLabelText(/edit task: test task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete task: test task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mark task complete: test task/i)).toBeInTheDocument();
  });
});
