import { Button, Text, type ButtonVariant } from '@expo/ui';

import { stretch } from '@/components/ui/modifiers';

type FullWidthButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
};

/** Primary action button that spans its container. */
export function FullWidthButton({
  label,
  onPress,
  variant = 'filled',
  disabled,
}: FullWidthButtonProps) {
  return (
    <Button
      variant={variant}
      onPress={onPress}
      disabled={disabled}
      modifiers={stretch.fullWidthButton}>
      <Text modifiers={stretch.buttonContent}>{label}</Text>
    </Button>
  );
}
