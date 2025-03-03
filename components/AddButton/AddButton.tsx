import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

import Icons from '@/helpers/icons';

interface AddButtonProps extends PressableProps {}

export default function AddButton({ onPress, testID }: AddButtonProps) {
  return (
    <Pressable style={styles.addButton} onPress={onPress} testID={testID}>
      {({ pressed }) => (
        <LinearGradient
          colors={pressed ? ['#AC712B', '#56340C'] : ['#D68424', '#6E3619']}
          style={styles.gradient}
          end={{ x: 0.6, y: 1.5 }}
          locations={[0.1, 1]}
        >
          <Icons.Plus/>
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  addButton: { alignSelf: 'center', marginBottom: 60 },
});
