import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import GuitarCard from '@/app/components/GuitarCard';
import images from '@/helpers/images';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('GuitarCard', () => {
  it('displays the card cover', () => {
    render(<GuitarCard id={1} type="electro" name="Good guitar" />);

    expect(screen.getByTestId('cardCover').props).toHaveProperty(
      'source',
      images.electroGuitarLarge
    );
  });

  it('displays the card title', () => {
    render(<GuitarCard id={1} type="electro" name="Good guitar" />);

    expect(screen.getByText('Good guitar')).toBeTruthy();
  });

  describe('when card is pressed', () => {
    it('navigates to the instrument page', () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
      render(<GuitarCard id={1} type="electro" name="Good guitar" />);

      const card = screen.getByTestId('card');
      fireEvent.press(card);

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/instrument',
        params: { id: 1 },
      });
    });
  });

  describe('when card is long pressed', () => {
    it('calls the given handler', async () => {
      const longPressFn = jest.fn();
      const user = userEvent.setup();
      render(
        <GuitarCard
          id={1}
          type="electro"
          name="Good Guitar"
          onLongPress={longPressFn}
        />
      );

      const card = screen.getByTestId('card');
      user.longPress(card);

      await waitFor(() => expect(longPressFn).toHaveBeenCalledWith(1));
    });
  });
});
