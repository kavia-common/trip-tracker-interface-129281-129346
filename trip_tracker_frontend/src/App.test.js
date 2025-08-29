import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Trip Tracker headline', () => {
  render(<App />);
  const title = screen.getByText(/Trip Tracker/i);
  expect(title).toBeInTheDocument();
});
