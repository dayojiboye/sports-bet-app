import { FieldGroup, Text } from '@expo/ui';

import { AppHost } from '@/components/app-host';

export default function MyBetsScreen() {
  return (
    <AppHost>
      <FieldGroup>
        <FieldGroup.Section title="Coming soon">
          <Text>Open and settled bets will appear here.</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </AppHost>
  );
}
