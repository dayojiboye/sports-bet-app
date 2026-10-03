import { FieldGroup, Text } from '@expo/ui';

import { AppHost } from '@/components/app-host';

export default function AccountScreen() {
  return (
    <AppHost>
      <FieldGroup>
        <FieldGroup.Section title="Coming soon">
          <Text>Wallet and preferences will appear here.</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </AppHost>
  );
}
