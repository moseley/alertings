import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import type { WatchRow } from "../lib/api";
import { Trash2, watchIcon } from "./icons";
import { IconChip, StatusBadge, ThresholdBar } from "./primitives";
import { cardShadow, colors, fonts, radius } from "./theme";
import {
  describeRule,
  describeWatch,
  watchImageUrl,
  watchStoreUrl,
  watchTitle,
} from "./watch-display";

/**
 * Two layouts, because the sources genuinely differ.
 *
 * Weather has a number worth plotting, so it keeps the Atlas shape: big
 * current reading against a threshold bar. Music and film have no numeric
 * threshold — they used to render a meaningless day count at 36px above a bar
 * that was hardcoded empty — so they lead with the artwork instead and demote
 * the day count to a caption.
 */
export function WatchCard({
  watch,
  current,
  onDelete,
  onEdit,
}: {
  watch: WatchRow;
  current?: number;
  onDelete: (id: string) => void;
  onEdit: (watch: WatchRow) => void;
}) {
  const { firing, value, delta, fill, caption } = describeWatch(watch, current);
  // Only weather has something to plot; the other two lead with imagery.
  const media = watch.source !== "weather";
  const Icon = watchIcon(watch.source, watch.config.rule?.metric);
  const image = watchImageUrl(watch);
  const storeUrl = watchStoreUrl(watch);

  return (
    // Tapping the card opens the editor; the delete button stops the press
    // from reaching here so the two don't fight.
    <Pressable
      style={styles.card}
      onPress={() => onEdit(watch)}
      accessibilityRole="button"
      accessibilityLabel={`Edit alert for ${watchTitle(watch)}`}
    >
      <View style={styles.header} pointerEvents="box-none">
        <View style={styles.identity}>
          {image ? (
            // Apple requires iTunes artwork to link to where the release can be
            // bought, so the sleeve opens the store rather than the editor.
            // Same stopPropagation dance as delete, for the same reason.
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`Open ${watchTitle(watch)} in Apple Music`}
              disabled={!storeUrl}
              onPress={(e) => {
                e.stopPropagation();
                if (storeUrl) void Linking.openURL(storeUrl);
              }}
              hitSlop={4}
            >
              <Image
                source={{ uri: image }}
                style={media ? styles.cover : styles.image}
                accessibilityIgnoresInvertColors
              />
            </Pressable>
          ) : (
            <IconChip icon={Icon} active={firing} />
          )}
          <View style={styles.identityText}>
            <Text style={styles.title} numberOfLines={1}>
              {watchTitle(watch)}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {describeRule(watch)}
            </Text>
            {media && (
              <Text style={styles.caption} numberOfLines={1}>
                {caption ?? delta}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight} pointerEvents="box-none">
          <StatusBadge firing={firing} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete watch for ${watchTitle(watch)}`}
            onPress={(e) => {
              // Without this the card's own press fires too and the editor
              // opens on the watch that was just deleted.
              e.stopPropagation();
              onDelete(watch.id);
            }}
            hitSlop={8}
            style={styles.delete}
          >
            <Trash2 size={15} color={colors.faint} />
          </Pressable>
        </View>
      </View>

      {!media && (
        <>
          <View style={styles.valueRow}>
            <Text style={[styles.value, !value && styles.valueEmpty]}>{value ?? "—"}</Text>
            <Text style={styles.delta}>{delta}</Text>
          </View>
          <ThresholdBar fill={fill} firing={firing} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.hairline,
    padding: 18,
    gap: 14,
    ...cardShadow,
  },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  identity: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  identityText: { flex: 1, minWidth: 0 },
  cover: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: colors.neutralBar,
  },
  caption: { fontFamily: fonts.regular, fontSize: 12, color: colors.faint, marginTop: 4 },
  image: {
    width: 34,
    height: 34,
    borderRadius: radius.chip,
    backgroundColor: colors.chipIdle,
  },
  title: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink, paddingRight: 104 },
  subtitle: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  headerRight: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  delete: { padding: 6 },

  valueRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  // 36px on mobile per the type scale.
  value: { fontFamily: fonts.bold, fontSize: 36, letterSpacing: -1.4, color: colors.ink },
  valueEmpty: { color: colors.neutralBar },
  delta: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, paddingBottom: 4, flexShrink: 1, textAlign: "right" },
});
