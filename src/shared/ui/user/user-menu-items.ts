import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faHotel,
  faReceipt,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

export type UserMenuItem =
  | {
      type: 'link';
      to: string;
      label: string;
      icon: IconDefinition;
    }
  | {
      type: 'action';
      label: string;
      icon: IconDefinition;
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
      icon: faUser,
    },
    {
      type: 'link',
      to: '/account/purchases',
      label: 'Mes achats',
      icon: faReceipt,
    },
  ];

  if (canAccessHostDashboard || hasProperty) {
    items.push({
      type: 'link',
      to: '/host',
      label: 'Gérer mon hôtel',
      icon: faHotel,
    });
  }

  items.push({
    type: 'action',
    label: 'Déconnexion',
    icon: faRightFromBracket,
    onSelect: onLogout,
  });

  return items;
}
