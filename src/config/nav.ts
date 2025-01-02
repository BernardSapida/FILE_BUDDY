import { Cog, HomeIcon } from 'lucide-react';

type AdditionalLinks = {
   title: string;
};

export const defaultLinks = [
   { href: '/', title: 'Home', icon: HomeIcon },
   { href: '/account', title: 'Account', icon: Cog }
];

export const additionalLinks: AdditionalLinks[] = [];
