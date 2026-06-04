import { createBrowserRouter } from 'react-router';
import HomePage from './modules/rooms/ui/pages/HomePage';
import SearchPage from './modules/rooms/ui/pages/SearchPage';
import RoomDetailPage from './modules/rooms/ui/pages/RoomDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: HomePage,
  },
  {
    path: '/search',
    Component: SearchPage,
  },
  {
    path: '/rooms/:id',
    Component: RoomDetailPage,
  },
]);

export default router;
