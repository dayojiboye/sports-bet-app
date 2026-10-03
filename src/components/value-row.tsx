import { Row, Spacer, Text } from '@expo/ui';

import { Spacing } from '@/constants/theme';

type ValueRowProps = {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
};

/** Label on the leading edge, value on the trailing edge. */
export function ValueRow({ label, value, valueColor, bold = false }: ValueRowProps) {
  return (
    <Row alignment="center" spacing={Spacing.three}>
      <Text>{label}</Text>
      <Spacer flexible />
      <Text textStyle={{ color: valueColor, fontWeight: bold ? '700' : undefined }}>{value}</Text>
    </Row>
  );
}
