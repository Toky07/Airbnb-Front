import { PillLink } from '../../../../../shared/ui';

type RoomTypeFilter = {
  slug: string;
  name: string;
};

type RoomTypeFilterBarProps = {
  roomTypes: RoomTypeFilter[];
  activeType: string;
  allTypesHref: string;
  buildTypeHref: (slug: string) => string;
};

const RoomTypeFilterBar = ({
  roomTypes,
  activeType,
  allTypesHref,
  buildTypeHref,
}: RoomTypeFilterBarProps) => {
  if (roomTypes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <PillLink to={allTypesHref} active={!activeType}>
        Tous
      </PillLink>
      {roomTypes.map((type) => (
        <PillLink key={type.slug} to={buildTypeHref(type.slug)} active={activeType === type.slug}>
          {type.name}
        </PillLink>
      ))}
    </div>
  );
};

export default RoomTypeFilterBar;
