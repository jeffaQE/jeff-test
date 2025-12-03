import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../components/TodoForm';

describe('TodoForm Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render add form when no initial data', () => {
    render(
      <TodoForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task name')).toBeInTheDocument();
    expect(screen.getByLabelText('Task description')).toBeInTheDocument();
  });

  it('should render edit form with initial data', () => {
    const initialData = {
      name: 'Test Task',
      description: 'Test Description',
      due_date: '2025-12-10',
      priority: 2,
    };

    render(
      <TodoForm
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('should call onSubmit with form data when submitted', async () => {
    const user = userEvent.setup();

    render(
      <TodoForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const nameInput = screen.getByLabelText('Task name');
    await user.type(nameInput, 'New Task');

    const descriptionInput = screen.getByLabelText('Task description');
    await user.type(descriptionInput, 'New Description');

    const submitButton = screen.getByRole('button', { name: /add/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Task',
          description: 'New Description',
        })
      );
    });
  });

  it('should call onClose when cancel button clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should require task name to submit', async () => {
    render(
      <TodoForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const submitButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('should handle priority selection', async () => {
    const user = userEvent.setup();

    render(
      <TodoForm open={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    const nameInput = screen.getByLabelText('Task name');
    await user.type(nameInput, 'Priority Task');

    const prioritySelect = screen.getByLabelText('Task priority');
    await user.click(prioritySelect);

    const highPriority = screen.getByText('High (1)');
    await user.click(highPriority);

    const submitButton = screen.getByRole('button', { name: /add/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Priority Task',
          priority: 1,
        })
      );
    });
  });
});
