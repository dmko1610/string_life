import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  IconButton,
  Menu,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeleteDialog from '@/app/components/DeleteDialog';
import { typeToIcon } from '@/helpers/iconizator';
import useDeleteDialog from '@/hooks/useDeleteDialog';
import useInstrument from '@/hooks/useInstrument';
import usePlayTimer from '@/hooks/usePlayTimer';
import { useTranslation } from '@/hooks/useTranslation';
import { KEYS } from '@/lib/i18n';
import { MyTheme } from '@/theme';

const GREEN_PLAYTIME = 20 * 60 * 60 * 1000;
const YELLOW_PLAYTIME = 40 * 60 * 60 * 1000;
const RED_PLAYTIME = 60 * 60 * 60 * 1000;

const HOURS = 1 * 60 * 60 * 1000;
const MINUTES = 1 * 60 * 1000;

export default function InstrumentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { t, locale } = useTranslation();
  const { colors } = useTheme<MyTheme>();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);

  const {
    loading,
    type,
    progress,
    replacementDate,
    saveProgress,
    deleteInstrument,
    refetch,
  } = useInstrument(id);

  const { isPlaying, start, stop } = usePlayTimer();
  const { hideDialog, showDialog, visible } = useDeleteDialog();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  const getProgressColor = (progress: number) => {
    if (progress <= GREEN_PLAYTIME) return colors.materialGreen;
    if (progress <= YELLOW_PLAYTIME) return colors.materialYellow;
    if (progress > RED_PLAYTIME) return colors.materialRed;
  };

  const daysSince = replacementDate
    ? Math.floor(
        (Date.now() - replacementDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const handlePress = async () => {
    if (isPlaying) {
      const elapsed = await stop();
      const newProgress = progress + elapsed;
      saveProgress(newProgress);
    } else {
      start();
    }
  };

  const handleNavigate = () => {
    router.navigate(`/screens/instrument/${id}/edit`);
    setShowMenu(false);
  };
  const handleOpenDeleteDialog = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setShowMenu(false);
    showDialog();
  };
  const handleDeleteCallback = async () => {
    router.back();
    await deleteInstrument();
  };
  const handleOpenMenu = () => setShowMenu(true);
  const handleCloseMenu = () => setShowMenu(false);

  useEffect(() => {
    if (!isPlaying) {
      pulseAnim.setValue(0);
      return;
    }

    pulseAnim.setValue(0);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [isPlaying, pulseAnim]);

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.4],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (loading) {
    return (
      <SafeAreaView
        edges={['left', 'right', 'bottom', 'top']}
        style={[
          styles.instrument,
          styles.instrumenLoading,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator animating={true} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.instrument, { backgroundColor: colors.background }]}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={type.toUpperCase()} />
        <Menu
          visible={showMenu}
          anchor={
            <Appbar.Action icon={'cog'} size={30} onPress={handleOpenMenu} />
          }
          onDismiss={handleCloseMenu}
        >
          <Menu.Item
            leadingIcon={'pencil'}
            title={t(KEYS.INSTRUMENT.EDIT_MENU_LABEL)}
            onPress={handleNavigate}
          />
          <Menu.Item
            leadingIcon={'delete'}
            title={t(KEYS.INSTRUMENT.DELETE_MENU_LABEL)}
            onPress={handleOpenDeleteDialog}
          />
        </Menu>
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={typeToIcon(type)}
            contentFit="contain"
            cachePolicy="memory"
            style={styles.image}
          />

          <Surface mode="flat" style={styles.replacementDate}>
            <Text variant="titleLarge">{`${t(KEYS.INSTRUMENT.REPL_LABEL)} : ${replacementDate.toLocaleDateString([locale], { dateStyle: 'medium' })}`}</Text>
            <Text variant="titleLarge">{`${t(KEYS.INSTRUMENT.DAYS_SINCE_LABEL)} ${daysSince}`}</Text>
          </Surface>
        </View>

        <View style={styles.playButtonContainer}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.playButtonPulse,
              {
                backgroundColor: colors.tertiary,
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
          />
          <IconButton
            icon={isPlaying ? 'stop' : 'play'}
            mode="contained-tonal"
            size={140}
            containerColor={isPlaying ? colors.tertiary : colors.primary}
            iconColor={isPlaying ? colors.onTertiary : colors.onPrimary}
            style={styles.playButton}
            animated={true}
            onPress={handlePress}
          />
        </View>

        <View style={styles.playtimeContainer}>
          <Text
            variant="headlineMedium"
            style={[styles.playtimeText, { color: getProgressColor(progress) }]}
          >
            {t(KEYS.INSTRUMENT.PLAYTIME_TEXT)}
            {Math.floor(progress / HOURS)}
            {t(KEYS.INSTRUMENT.HOURS_TEXT)}
            {Math.floor((progress % HOURS) / MINUTES)}
            {t(KEYS.INSTRUMENT.MINUTES_TEXT)}
          </Text>
        </View>
      </View>

      <DeleteDialog
        deleteId={id}
        visible={visible}
        deleteFn={handleDeleteCallback as () => Promise<void>}
        hideDialog={hideDialog}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  replacementDate: { padding: 16, borderRadius: 10, marginTop: 24 },
  playtimeContainer: {
    padding: 20,
    alignItems: 'center',
  },
  playtimeText: {
    textAlign: 'center',
  },
  playButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonPulse: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  playButton: { alignSelf: 'center' },
  imageContainer: { flex: 1 },
  image: { width: '100%', height: '70%' },
  instrument: {
    flex: 1,
    paddingHorizontal: 16,
  },
  instrumenLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 6,
  },
});
