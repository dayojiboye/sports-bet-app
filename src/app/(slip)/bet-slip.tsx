import { FieldGroup, Text } from '@expo/ui';

import { AppHost } from '@/components/app-host';

export default function BetSlipScreen() {
  return (
    <AppHost>
      <FieldGroup>
        <FieldGroup.Section title="Coming soon">
          <Text>Your selections will appear here.</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </AppHost>
  );
}
