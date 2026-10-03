import { Button, Icon, Row, ScrollView, Text, type IconName } from '@expo/ui';

import { Spacing } from '@/constants/theme';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  icon?: IconName;
};

type ChipGroupProps<T extends string> = {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Single-choice row of chips that scrolls horizontally when it doesn't fit. */
export function ChipGroup<T extends string>({ options, value, onChange }: ChipGroupProps<T>) {
  return (
    <ScrollView direction="horizontal" showsIndicators={false}>
      <Row spacing={Spacing.two} alignment="center">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={option.value === value ? 'filled' : 'outlined'}
            onPress={() => onChange(option.value)}>
            <Row spacing={Spacing.two} alignment="center">
              {option.icon ? <Icon name={option.icon} size={18} /> : null}
              <Text>{option.label}</Text>
            </Row>
          </Button>
        ))}
      </Row>
    </ScrollView>
  );
}
