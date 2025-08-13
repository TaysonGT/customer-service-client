import { render, screen, fireEvent } from '@testing-library/react';
import Chatbox from './ChatBox';

describe('Chatbox', () => {
  it('renders chat header and messages', () => {
    render(<Chatbox chatId="1" />);
    // Use a flexible matcher in case the text is split across elements
    expect(screen.getByText((content) => content.includes('Hello'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Test'))).toBeInTheDocument();
  });

  it('sends a message', async () => {
    render(<Chatbox chatId="1" />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    // You can add more assertions here for optimistic UI, etc.
  });
});
