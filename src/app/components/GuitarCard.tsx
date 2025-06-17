import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet } from 'react-native';
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
  testID?: string;
}

export default function GuitarCard({
  id,
  type,
  name,
  onLongPress,
  testID = 'guitarCard',
}: IGuitarCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const [longPressed, setLongPressed] = useState(false);

  const handleLongPress = () => {
    setLongPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    onLongPress?.(id);

    setTimeout(() => {
      setLongPressed(false);
    }, 1000);
  };

  const navigate = () => router.navigate(`/screens/instrument/${id}`);

  return (
    <Pressable onLongPress={handleLongPress} onPress={navigate} testID={testID}>
      <Card
        mode="contained"
        contentStyle={[
          styles.card,
          { backgroundColor: longPressed ? colors.tertiary : colors.primary },
        ]}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
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
