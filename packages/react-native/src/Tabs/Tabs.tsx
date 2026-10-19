import { Pressable, ScrollView, View } from 'react-native';
import type { TabsProps } from '@valencesoftwareio/types';
import { useTheme } from 'ThemeProvider';
import { Typography } from 'Typography';

export const Tabs = ({ options, value, onChange, label }: TabsProps) => {
  const theme = useTheme();
  const selected = options.find((option) => option.value === value);
  const textContent =
    typeof selected?.content === 'string' || typeof selected?.content === 'number';

  return (
    <View style={{ width: '100%' }} accessibilityRole="tablist" accessibilityLabel={label}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colorBorderDivider,
        }}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          const isDisabled = option.disabled || !onChange;
          let color = isSelected ? theme.colorTextPrimary : theme.colorTextSecondary;

          if (isDisabled) {
            color = theme.colorTextMuted;
          }

          return (
            <Pressable
              key={option.value}
              disabled={isDisabled}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected, disabled: isDisabled }}
              onPress={() => onChange?.(option.value)}
              style={{
                minHeight: theme.controlMinimumTarget,
                minWidth: 72,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: theme.spacingMd,
                borderBottomWidth: 2,
                borderBottomColor: isSelected ? theme.colorTextPrimary : 'transparent',
              }}
            >
              <Typography
                variant="controlLabel"
                style={{
                  color,
                }}
              >
                {option.label}
              </Typography>
            </Pressable>
          );
        })}
      </ScrollView>
      {selected && (
        <View style={{ paddingVertical: theme.spacingMd }}>
          {textContent ? (
            <Typography variant="body">{selected.content}</Typography>
          ) : (
            selected.content
          )}
        </View>
      )}
    </View>
  );
};
