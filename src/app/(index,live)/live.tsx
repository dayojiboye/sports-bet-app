import { FieldGroup, Text } from '@expo/ui';

import { AppHost } from '@/components/app-host';

export default function LiveScreen() {
  return (
    <AppHost>
      <FieldGroup>
        <FieldGroup.Section title="Coming soon">
          <Text>In-play matches will appear here.</Text>
        </FieldGroup.Section>
      </FieldGroup>
    </AppHost>
  );
}
