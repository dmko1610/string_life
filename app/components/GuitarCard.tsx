import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

import { typeToIcon } from '@/helpers/iconizator';

const HORIZONTAL_MARGIN = 32;
const HALF_SIZE = 2;
const PADDING = 4;

const width = Dimensions.get('window').width;
const calculatedElementWidth: number =
  width / HALF_SIZE - HORIZONTAL_MARGIN - PADDING;

interface IGuitarCardProps {
  id: number;
  type: string;
  name: string;
  onLongPress?: (id: number) => void;
}

export default function GuitarCard({
  id,
  type,
  name,
  onLongPress,
}: IGuitarCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Card
      mode="contained"
      contentStyle={[styles.card, { backgroundColor: colors.primary }]}
      onPress={() =>
        router.push({
          pathname: '/instrument',
          params: { id },
        })
      }
      onLongPress={() => onLongPress(id)}
      testID="card"
    >
      <Card.Cover
        resizeMode="contain"
        resizeMethod="resize"
        source={typeToIcon(type)}
        style={[
          styles.cardCover,
          {
            width: calculatedElementWidth,
            backgroundColor: colors.background,
          },
        ]}
        testID="cardCover"
      />
      <Card.Title
        title={name}
        titleStyle={[styles.cardTitle, { color: colors.onPrimary }]}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 6,
    paddingTop: 6,
    borderRadius: 12,
  },
  cardCover: {
    borderRadius: 6,
    padding: 8,
  },
  cardTitle: {
    alignSelf: 'center',
  },
});
