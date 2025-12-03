import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from '../components/TodoList';

describe('TodoList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleComplete = jest.fn();
  const mockOnSortChange = jest.fn();
  const mockOnSortOrderChange = jest.fn();

  const mockTasks = [
    {
      id: 1,
      name: 'Task 1',
      description: 'Description 1',
      due_date: '2025-12-10',
      priority: 1,
      completed: 0,
    },
    {
      id: 2,
      name: 'Task 2',
      description: 'Description 2',
      due_date: null,
      priority: 3,
      completed: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render list of tasks', () => {
    render(
      <TodoList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        sortBy="created_at"
        onSortChange={mockOnSortChange}
        sortOrder="DESC"
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('should display empty state when no tasks', () => {
    render(
      <TodoList
        tasks={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        sortBy="created_at"
        onSortChange={mockOnSortChange}
        sortOrder="DESC"
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('should call onSortChange when sort dropdown changed', async () => {
    const user = userEvent.setup();

    render(
      <TodoList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        sortBy="created_at"
        onSortChange={mockOnSortChange}
        sortOrder="DESC"
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const sortSelect = screen.getByLabelText(/sort tasks by/i);
    await user.click(sortSelect);

    const dueDateOption = screen.getByText('Due Date');
    await user.click(dueDateOption);

    expect(mockOnSortChange).toHaveBeenCalledWith('due_date');
  });

  it('should call onSortOrderChange when order dropdown changed', async () => {
    const user = userEvent.setup();

    render(
      <TodoList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        sortBy="created_at"
        onSortChange={mockOnSortChange}
        sortOrder="DESC"
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const orderSelect = screen.getByLabelText(/sort order/i);
    await user.click(orderSelect);

    const ascOption = screen.getByText('Ascending');
    await user.click(ascOption);

    expect(mockOnSortOrderChange).toHaveBeenCalledWith('ASC');
  });

  it('should render correct number of tasks', () => {
    const { container } = render(
      <TodoList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        sortBy="created_at"
        onSortChange={mockOnSortChange}
        sortOrder="DESC"
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(mockTasks.length);
  });

  it('should have accessible sort controls', () => {
    render(
      <TodoList
        tasks={mockTasks}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onToggleComplete={mockOnToggleComplete}
        sortBy="created_at"
        onSortChange={mockOnSortChange}
        sortOrder="DESC"
        onSortOrderChange={mockOnSortOrderChange}
      />
    );

    expect(screen.getByLabelText(/sort tasks by/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sort order/i)).toBeInTheDocument();
  });
});
