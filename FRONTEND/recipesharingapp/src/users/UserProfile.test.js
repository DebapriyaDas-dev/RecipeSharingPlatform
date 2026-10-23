import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import UserProfile from './UserProfile';

jest.mock('axios');

const user = {
  id: 'u1',
  name: 'Meera Kapoor',
  email: 'meera@example.test',
  recipes: [],
  ratings: [
    { ratingId: 'r1', recipeId: 'gone', rating: 5, comment: 'Needed more salt', recipe: null },
    {
      ratingId: 'r2',
      recipeId: 'c1',
      rating: 9,
      comment: 'Lovely',
      recipe: { recipeId: 'c1', name: 'Chocolate Cake' },
    },
  ],
};

beforeEach(() => {
  axios.get.mockImplementation((url) => {
    if (url.endsWith('/users/u1')) return Promise.resolve({ data: user });
    if (url.endsWith('/recipes/user/u1'))
      return Promise.resolve({ data: [{ recipeId: 'c2', name: 'Soya Chaap', cookingTime: '00:40:00', createdAt: '2023-06-18' }] });
    return Promise.reject(new Error(`unexpected ${url}`));
  });
});

test('lists recipes and shows a deleted recipe as "Recipe removed" in reviews', async () => {
  render(
    <MemoryRouter>
      <UserProfile userId="u1" isOwn={false} />
    </MemoryRouter>
  );

  expect(await screen.findByRole('heading', { name: 'Meera Kapoor' })).toBeInTheDocument();
  expect(await screen.findByText('Soya Chaap')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: /reviews/i }));

  expect(await screen.findByText('Recipe removed', {}, { timeout: 3000 })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Chocolate Cake' })).toHaveAttribute('href', '/view-recipe/c1');
  expect(screen.getByText('Needed more salt')).toBeInTheDocument();
});
