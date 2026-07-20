import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type UserMenuItem =
  | {
      type: 'link';
      to: string;
      label: string;
      icon: IconProp;
    }
  | {
      type: 'action';
      label: string;
      icon: IconProp;
      onSelect: () => void;
    };

type BuildUserMenuItemsParams = {
  canAccessHostDashboard: boolean;
  hasProperty?: boolean;
  onLogout: () => void;
};

export function buildUserMenuItems({
  canAccessHostDashboard,
  hasProperty,
  onLogout,
}: BuildUserMenuItemsParams): UserMenuItem[] {
  const items: UserMenuItem[] = [
    {
      type: 'link',
      to: '/account/profile',
      label: 'Mon profil',
      icon: 'user',
    },
    {
      type: 'link',
      to: '/account/purchases',
      label: 'Mes achats',
      icon: 'receipt',
    },
  ];

  if (canAccessHostDashboard || hasProperty) {
    items.push({
      type: 'link',
      to: '/host',
      label: 'Gérer mon hôtel',
      icon: 'hotel',
    });
  }

  items.push({
    type: 'action',
    label: 'Déconnexion',
    icon: 'right-from-bracket',
    onSelect: onLogout,
  });

  return items;
}
