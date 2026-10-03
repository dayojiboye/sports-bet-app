import { Icon } from '@expo/ui';

import type { Sport } from '@/data/types';

type IconSource = ReturnType<typeof Icon.select>;

/** SF Symbols on iOS, Material Symbols on Android. */
export const SportIcons: Record<Sport, IconSource> = {
  football: Icon.select({
    ios: 'soccerball',
    android: import('@expo/material-symbols/sports_soccer.xml'),
  }),
  basketball: Icon.select({
    ios: 'basketball.fill',
    android: import('@expo/material-symbols/sports_basketball.xml'),
  }),
  tennis: Icon.select({
    ios: 'tennisball.fill',
    android: import('@expo/material-symbols/sports_tennis.xml'),
  }),
};

export const CloseIcon = Icon.select({
  ios: 'xmark.circle.fill',
  android: import('@expo/material-symbols/close.xml'),
});

export const SuccessIcon = Icon.select({
  ios: 'checkmark.circle.fill',
  android: import('@expo/material-symbols/check_circle.xml'),
});

export const BetSlipIcon = Icon.select({
  ios: 'ticket',
  android: import('@expo/material-symbols/receipt_long.xml'),
});

export const AccountIcon = Icon.select({
  ios: 'person.crop.circle.fill',
  android: import('@expo/material-symbols/account_circle.xml'),
});
