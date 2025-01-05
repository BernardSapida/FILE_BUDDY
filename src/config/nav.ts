// config/nav.ts
type NavLink = {
   label: string;
   href: string;
};

type UserNavConfig = {
   [role: string]: NavLink[];
};

const navConfig: UserNavConfig = {
   guest: [],
   user: [
      { label: 'Folders', href: '/folders' },
      { label: 'Files', href: '/files' },
      { label: 'Favorites', href: '/favorites' },
      { label: 'Archives', href: '/archives' },
      { label: 'Trash', href: '/trash' }
   ]
};

const generateRouteAccessMap = (): RouteAccessMap => {
   const map: RouteAccessMap = {};

   Object.entries(navConfig).forEach(([role, links]) => {
      links.forEach((link) => {
         if (!map[link.href]) {
            map[link.href] = [];
         }
         map[link.href].push(role as Role);
      });
   });
   return map;
};

export const getLinksForRole = (role: Role): NavLink[] => navConfig[role];
export const routeAccessMap = generateRouteAccessMap();
