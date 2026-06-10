import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faHotel,
  faReceipt,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { AuthSession } from '../../../modules/auth/core/types/auth.types';
import {
  getUserDisplayName,
  getUserInitials,
} from '../../utils/user-display';
import UserAvatar from './UserAvatar';

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

type UserMenuProps = {
  session: AuthSession;
  email: string | null;
  canAccessHostDashboard: boolean;
  hasProperty?: boolean;
  onLogout: () => void;
};

export function buildUserMenuItems({
  canAccessHostDashboard,
  hasProperty,
  onLogout,
}: Pick<UserMenuProps, 'canAccessHostDashboard' | 'hasProperty' | 'onLogout'>): UserMenuItem[] {
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

const UserMenu = ({
  session,
  email,
  canAccessHostDashboard,
  hasProperty = false,
  onLogout,
}: UserMenuProps) => {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const displayName = getUserDisplayName(session);
  const initials = getUserInitials(session);
  const items = buildUserMenuItems({ canAccessHostDashboard, hasProperty, onLogout });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition hover:border-slate-300 hover:shadow-md"
      >
        <UserAvatar
          src={session.profile?.avatar}
          initials={initials}
          alt={displayName}
          size="sm"
        />
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-800 sm:inline">
          {displayName}
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={[
            'h-3 w-3 text-slate-400 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[240px] origin-top-right animate-menu-enter overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{email}</p>
          </div>

          <div className="py-1">
            {items.map((item) =>
              item.type === 'link' ? (
                <Link
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-slate-400" />
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    item.onSelect();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-red-50 hover:text-red-600"
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  {item.label}
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserMenu;
