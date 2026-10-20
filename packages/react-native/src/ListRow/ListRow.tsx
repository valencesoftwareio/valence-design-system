import { Pressable, View, type ViewStyle } from 'react-native';
import type { ListRowProps } from '@valencesoftwareio/types';
import { useTheme } from '@/ThemeProvider';
import { GEIST } from '@/foundations/fonts';
import { Typography } from '@/Typography';
import { useReduceMotion } from '@/hooks/useReduceMotion';

export const ListRow = ({
  icon,
  title,
  subtitle,
  trailingIcon,
  archived,
  grouped,
  onPress,
}: ListRowProps) => {
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  const accessibleLabel = [title, archived ? 'archived' : undefined, subtitle]
    .filter(Boolean)
    .join(', ');
  const content = (
    <>
      {icon != null && (
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            backgroundColor: theme.colorBackgroundPrimary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {typeof icon === 'string' || typeof icon === 'number' ? (
            <Typography variant="body">{icon}</Typography>
          ) : (
            icon(theme.colorTextPrimary)
          )}
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Typography
          variant="body"
          style={{
            ...GEIST.bold,
            color: theme.colorTextPrimary,
            textDecorationLine: archived ? 'line-through' : 'none',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="meta" style={{ color: theme.colorTextReadable, marginTop: 2 }}>
            {subtitle}
          </Typography>
        )}
      </View>
      {trailingIcon != null && (
        <View
          style={{ marginStart: 'auto' }}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {typeof trailingIcon === 'string' || typeof trailingIcon === 'number' ? (
            <Typography variant="body" style={{ color: theme.colorTextSecondary }}>
              {trailingIcon}
            </Typography>
          ) : (
            trailingIcon(theme.colorTextSecondary)
          )}
        </View>
      )}
    </>
  );
  const rowStyle: ViewStyle = {
    backgroundColor: theme.colorBackgroundRaised,
    borderRadius: grouped ? 0 : 14,
    paddingVertical: theme.spacingMd,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacingMd,
    boxShadow: grouped ? undefined : theme.shadowSurface,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibleLabel}
        style={({ pressed }) => ({
          ...rowStyle,
          transform: [{ scale: pressed && !reduceMotion ? 0.99 : 1 }],
        })}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{content}</View>;
};
