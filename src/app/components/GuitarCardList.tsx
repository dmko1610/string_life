import { ScrollView, StyleSheet, View } from 'react-native';

import { Instrument } from '@/model/types';

import GuitarCard from './GuitarCard';

interface GuitarCardListProps {
  instruments: Instrument[];
  showDeleteDialog: (id: number) => void;
}

export default function GuitarCardList({
  instruments,
  showDeleteDialog,
}: GuitarCardListProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.instrumentList}
      showsVerticalScrollIndicator={false}
      testID="guitarCardList"
    >
      <View style={styles.instrumentListWrapper}>
        {instruments.map((instrument) => (
          <GuitarCard
            key={instrument.id}
            id={instrument.id}
            type={instrument.type}
            name={instrument.name}
            onLongPress={showDeleteDialog}
            testID="instrument"
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  instrumentList: {
    paddingTop: 30,
    paddingBottom: 80,
  },
  instrumentListWrapper: {
    flexWrap: 'wrap',
    rowGap: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
