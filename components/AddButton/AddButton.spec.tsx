import { render, screen } from '@testing-library/react-native';

import AddButton from './AddButton';

describe('AddButton', () => {
  it('displays the button', () => {
    render(<AddButton testID="button" />);

    expect(screen.getByTestId('button')).toBeTruthy();
    expect(screen.getByTestId('plusIcon')).toBeTruthy()
  });
});
