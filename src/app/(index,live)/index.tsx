import { FieldGroup, Text } from '@expo/ui';

import { AppHost } from '@/components/app-host';

export default function SportsScreen() {
  return (
    <AppHost>
      <FieldGroup>
        <FieldGroup.Section title="Coming soon">
          <Text>Football, basketball and tennis markets will appear here.</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </AppHost>
  );
}
