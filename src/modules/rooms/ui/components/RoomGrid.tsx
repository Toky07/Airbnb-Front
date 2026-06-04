import type { RoomListItem } from '../../core/types/room.types';
import RoomCard from './RoomCard';

type RoomGridProps = {
  rooms: RoomListItem[];
};

const RoomGrid = ({ rooms }: RoomGridProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {rooms.map((room) => (
      <RoomCard key={room.id} room={room} />
    ))}
  </div>
);

export default RoomGrid;
