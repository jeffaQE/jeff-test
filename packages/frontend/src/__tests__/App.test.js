import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders the header', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);
    
    expect(screen.getByLabelText('Loading tasks')).toBeInTheDocument();
  });

  it('loads and displays tasks', async () => {
    const mockTasks = [
      {
        id: 1,
        name: 'Test Task 1',
        description: 'Description 1',
        due_date: null,
        priority: 3,
        completed: 0,
      },
      {
        id: 2,
        name: 'Test Task 2',
        description: 'Description 2',
        due_date: '2025-12-10',
        priority: 1,
        completed: 0,
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  it('shows empty state when no tasks', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
    });
  });

  it('opens add form when add button clicked', async () => {
    const user = userEvent.setup();
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading tasks')).not.toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });
});
