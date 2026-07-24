import { PillLink } from '../../../../../shared/ui';
import type { RoomTypeOption } from '../../hooks/useRoomTypeOptions';

type RoomTypeFilterBarProps = {
  roomTypes: RoomTypeOption[];
  activeRoomTypeId?: number;
  allTypesHref: string;
  buildTypeHref: (roomTypeId: number) => string;
};

const RoomTypeFilterBar = ({
  roomTypes,
  activeRoomTypeId,
  allTypesHref,
  buildTypeHref,
}: RoomTypeFilterBarProps) => {
  if (roomTypes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <PillLink to={allTypesHref} active={!activeRoomTypeId}>
        Tous
      </PillLink>
      {roomTypes.map((type) => (
        <PillLink
          key={type.id}
          to={buildTypeHref(type.id)}
          active={activeRoomTypeId === type.id}
        >
          {type.name}
        </PillLink>
      ))}
    </div>
  );
};

export default RoomTypeFilterBar;
