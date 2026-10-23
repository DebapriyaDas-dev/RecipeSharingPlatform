import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('shows the sign-in page to a signed-out visitor', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /create account/i })).toBeInTheDocument();
});

test('treats a stored "false" as signed out', () => {
  localStorage.setItem('loggedIn', 'false');
  render(<App />);
  expect(screen.queryByRole('button', { name: /open menu/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
});
