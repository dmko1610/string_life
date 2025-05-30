import { Image, ImageBackground } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';

import images from '@/helpers/images';

const emptyStateWidth = Dimensions.get('window').width;

export default function EmptyState() {
  return (
    <View style={styles.imageBackgroundCentered}>
      <ImageBackground
        source={images.emptyStateBackground}
        contentFit="contain"
        testID="imageBackground"
      >
        <Image
          source={images.emptyState}
          style={styles.image}
          contentFit="contain"
          testID="image"
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: emptyStateWidth,
    height: emptyStateWidth,
    aspectRatio: 1,
  },
  imageBackgroundCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 88
  },
});
