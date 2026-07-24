import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { AuthSession } from '../../../modules/auth/core/types/auth.types';
import {
  getUserDisplayName,
  getUserInitials,
} from '../../utils/user-display';
import UserAvatar from './UserAvatar';
import { buildUserMenuItems } from './user-menu-items';

type UserMenuProps = {
  session: AuthSession;
  email: string | null;
  canAccessHostDashboard: boolean;
  hasProperty?: boolean;
  onBecomeHost?: () => void;
  onLogout: () => void;
};

const UserMenu = ({
  session,
  email,
  canAccessHostDashboard,
  hasProperty = false,
  onBecomeHost,
  onLogout,
}: UserMenuProps) => {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const displayName = getUserDisplayName(session);
  const initials = getUserInitials(session);
  const items = buildUserMenuItems({
    canAccessHostDashboard,
    hasProperty,
    onBecomeHost,
    onLogout,
  });

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
        className="flex items-center gap-2 rounded-xl border border-line bg-surface py-1.5 pl-1.5 pr-3 transition duration-200 hover:border-brand/30 hover:bg-mist"
      >
        <UserAvatar
          src={session.profile?.avatar}
          initials={initials}
          alt={displayName}
          size="sm"
        />
        <span className="hidden max-w-[140px] truncate text-sm font-medium text-ink sm:inline">
          {displayName}
        </span>
        <FontAwesomeIcon
          icon="chevron-down"
          className={[
            'h-3 w-3 text-ink/40 transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-[240px] origin-top-right animate-menu-enter overflow-hidden rounded-2xl border border-line bg-surface py-2 soft-shadow"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{displayName}</p>
            <p className="truncate text-xs text-ink/60">{email}</p>
          </div>

          <div className="py-1">
            {items.map((item) =>
              item.type === 'link' ? (
                <Link
                  key={item.to}
                  to={item.to}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink/80 transition duration-200 hover:bg-mist hover:text-ink"
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-ink/40" />
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
                  className={[
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition duration-200',
                    item.danger
                      ? 'text-ink/80 hover:bg-red-50 hover:text-red-600'
                      : 'text-ink/80 hover:bg-mist hover:text-ink',
                  ].join(' ')}
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
