import { Pressable, View } from 'react-native';
import type { AccordionProps } from '@valencesoftwareio/types';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { ChevronIcon } from '../icons';
import { Typography } from '../Typography/Typography';
import { GEIST } from '../foundations/fonts';

export const Accordion = ({ title, expanded, onChange, children }: AccordionProps) => {
  const theme = useTheme();

  return (
    <View>
      <Pressable
        disabled={!onChange}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={title}
        onPress={() => onChange?.(!expanded)}
        style={{
          minHeight: theme.controlMinimumTarget,
          paddingVertical: theme.spacingMd,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
        }}
      >
        <Typography variant="body" style={{ flex: 1, ...GEIST.semibold }}>
          {title}
        </Typography>
        <View style={{ marginTop: 3, transform: [{ rotate: expanded ? '-90deg' : '90deg' }] }}>
          <ChevronIcon
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            size={14}
            color={theme.colorTextSecondary}
            strokeWidth={1.6}
            absoluteStrokeWidth
          />
        </View>
      </Pressable>
      {expanded && (
        <View style={{ paddingStart: 14, paddingEnd: 46, paddingBottom: theme.spacingMd }}>
          {children}
        </View>
      )}
    </View>
  );
};
