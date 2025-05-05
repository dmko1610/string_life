import { fireEvent, render, screen } from '@testing-library/react-native';

import GuitarCardList from '@/app/components/GuitarCardList';
import { Instrument } from '@/model/types';

jest.mock('@/app/components/GuitarCard', () => 'GuitarCard');

const mockedInstruments: Instrument[] = [
  {
    id: 1,
    name: 'Shmort X5',
    type: 'electro',
    replacement_date: 0,
    progress: 0,
  },
];

function renderGuitarCardList({
  instruments = mockedInstruments,
  showDeleteDialog = jest.fn(),
}) {
  render(
    <GuitarCardList
      instruments={instruments}
      showDeleteDialog={showDeleteDialog}
    />
  );
}

describe('GuitarCardList', () => {
  it('displays the list', () => {
    renderGuitarCardList({});

    expect(screen.getByTestId('guitarCardList')).toBeTruthy();
  });

  describe('instruments', () => {
    it('displays all the elements', () => {
      const mockInstruments: Instrument[] = [
        {
          id: 1,
          name: 'Shmort X5',
          type: 'electro',
          replacement_date: 0,
          progress: 0,
        },
        {
          id: 2,
          name: 'Bort X2',
          type: 'electro',
          replacement_date: 0,
          progress: 0,
        },
      ];
      renderGuitarCardList({ instruments: mockInstruments });

      const instruments = screen.getAllByTestId('instrument');

      expect(instruments).toHaveLength(2);
      expect(instruments.at(1).props).toHaveProperty('name', 'Bort X2');
      expect(instruments.at(1).props).toHaveProperty('type', 'electro');
    });
  });

  describe('showDeleteDialog', () => {
    it('calls given fn', () => {
      const mockShowDeleteDialog = jest.fn();
      renderGuitarCardList({ showDeleteDialog: mockShowDeleteDialog });

      const instruments = screen.getAllByTestId('instrument');
      fireEvent(instruments.at(0), 'longPress');

      expect(mockShowDeleteDialog).toHaveBeenCalledTimes(1);
    });
  });
});
