import { render, screen } from '@testing-library/react-native';

import EmptyState from '@/app/components/EmptyState';
import images from '@/helpers/images';

jest.mock('expo-image', () => {
  const actualExpoImage = jest.requireActual('expo-image');
  const { Image } = jest.requireActual('react-native');

  return { ...actualExpoImage, Image };
});

describe('EmptyState', () => {
  it('displays the empty state image background', () => {
    render(<EmptyState />);

    expect(screen.getByTestId('imageBackground').props).toHaveProperty(
      'source',
      [images.emptyStateBackground]
    );
  });

  it('displays the empty state image', () => {
    render(<EmptyState />);

    expect(screen.getByTestId('image').props).toHaveProperty(
      'source',
      images.emptyState
    );
  });
});
