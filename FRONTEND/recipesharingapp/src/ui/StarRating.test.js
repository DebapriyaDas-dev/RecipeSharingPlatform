import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StarPicker } from './StarRating';

const Harness = () => {
  const [value, setValue] = useState(0);
  return <StarPicker value={value} onChange={setValue} />;
};

const numbers = (container) => [...container.querySelectorAll('.sn-picker__number')].map((n) => n.textContent);

test('sweeping across the stars never leaves more than one score on screen', () => {
  const { container } = render(<Harness />);
  const stars = screen.getAllByRole('radio');
  const group = screen.getByRole('radiogroup');

  // Fast sweep right, back left, then leave the row
  [...stars, ...[...stars].reverse()].forEach((star) => {
    fireEvent.mouseEnter(star);
    expect(numbers(container)).toHaveLength(1);
  });
  fireEvent.mouseEnter(stars[8]);
  fireEvent.mouseLeave(group);

  expect(numbers(container)).toEqual(['0']);
  expect(screen.getByText(/tap a star to rate/i)).toBeInTheDocument();
});

test('clicking a star sets the score and keyboard arrows adjust it', () => {
  const { container } = render(<Harness />);
  fireEvent.click(screen.getByRole('radio', { name: '8 out of 10' }));
  fireEvent.mouseLeave(screen.getByRole('radiogroup'));
  expect(numbers(container)).toEqual(['8']);
  expect(screen.getByText(/delicious/i)).toBeInTheDocument();

  fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });
  expect(numbers(container)).toEqual(['9']);
  expect(screen.getByRole('radio', { name: '9 out of 10' })).toHaveAttribute('aria-checked', 'true');
});
