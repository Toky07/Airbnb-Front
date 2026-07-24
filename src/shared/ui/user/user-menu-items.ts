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
      danger?: boolean;
    };

type BuildUserMenuItemsParams = {
  canAccessHostDashboard: boolean;
  hasProperty?: boolean;
  onBecomeHost?: () => void;
  onLogout: () => void;
};

export function buildUserMenuItems({
  canAccessHostDashboard,
  hasProperty,
  onBecomeHost,
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
    {
      type: 'link',
      to: '/account/favorites',
      label: 'Mes favoris',
      icon: 'heart',
    },
    {
      type: 'link',
      to: '/account/messages',
      label: 'Mes messages',
      icon: 'envelope',
    },
  ];

  if (canAccessHostDashboard || hasProperty) {
    items.push({
      type: 'link',
      to: '/host',
      label: 'Gérer mon hôtel',
      icon: 'hotel',
    });
  } else if (onBecomeHost) {
    items.push({
      type: 'action',
      label: 'Devenir hôte',
      icon: 'hotel',
      onSelect: onBecomeHost,
    });
  }

  items.push({
    type: 'action',
    label: 'Déconnexion',
    icon: 'right-from-bracket',
    onSelect: onLogout,
    danger: true,
  });

  return items;
}
