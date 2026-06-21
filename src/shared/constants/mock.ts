export const SHOW_EMPTY_RECENT_STRATEGIES = true;
export const SHOW_LOADING_RECENT_STRATEGIES = true;

export const MOCK_USER = {
  name: '박세윤',
  email: 'seun0714@naver.com',
  profileImage: 'https://loremflickr.com/100/100',
} as const;

export const MOCK_MAIN_NAV_ITEMS = [
  {
    label: '포폴 전략',
    href: '/',
    active: true,
    icon: 'target',
  },
  {
    label: '경험 관리',
    href: '/experience',
    active: false,
    icon: 'briefcase',
  },
] as const;

export const MOCK_RECENT_STRATEGIES = [
  {
    id: '1',
    title: '당근 Frontend 개발자 채용',
    date: '2026. 06. 02',
    href: '/strategy/1/result',
  },
  {
    id: '2',
    title: '토스 Backend 개발자 채용',
    date: '2026. 06. 01',
    href: '/strategy/2/result',
  },
] as const;
