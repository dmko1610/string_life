import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  IconButton,
  Menu,
  ProgressBar,
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

const TARGET_TIME_SECONDS = 100 * 60 * 60 * 1000;

export default function InstrumentDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { t, locale } = useTranslation();
  const { colors } = useTheme();
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

      <View style={styles.imageContainer}>
        <Image
          source={typeToIcon(type)}
          contentFit="contain"
          cachePolicy="memory"
          style={styles.image}
        />

        <Surface mode="flat" style={styles.replacementDate}>
          <Text variant="titleLarge">{`${t(KEYS.INSTRUMENT.REPL_LABEL)} : ${replacementDate.toLocaleDateString([locale], { dateStyle: 'long' })}`}</Text>
          <Text variant="titleLarge">{`${t(KEYS.INSTRUMENT.DAYS_SINCE_LABEL)} ${daysSince}`}</Text>
        </Surface>
      </View>

      <View style={styles.playButtonContainer}>
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

      <Text>{`${Math.floor(progress / 60_000)} min / ${TARGET_TIME_SECONDS / 60_000} min`}</Text>
      <View style={styles.playtimeContainer}>
        <Text style={styles.playtimeText}>
          {t(KEYS.INSTRUMENT.PLAY_TIME_LABEL)}
        </Text>
        <Text style={styles.playtimeText}>
          {t(KEYS.INSTRUMENT.END_TIME_LABEL)}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <ProgressBar
          progress={parseFloat((progress / TARGET_TIME_SECONDS).toFixed(2))}
          color={colors.primary}
        />
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
  replacementDate: { padding: 16, borderRadius: 10, marginTop: 24 },
  playtimeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  playtimeText: { fontSize: 16, marginBottom: 4 },
  playButtonContainer: { marginBottom: 50 },
  playButton: { alignSelf: 'center' },
  progressBar: { marginBottom: 70 },
  imageContainer: { flex: 1, justifyContent: 'flex-start' },
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
