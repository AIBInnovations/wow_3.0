export type NavItem = {
  /** Original stacking-order modifier — drives z-index and panel shade. */
  className: string
  href: string
  label: string
  /** Text that scrolls across the row on hover. */
  hover: string
}

export const navItems: NavItem[] = [
  { className: 'nl2', href: '/about', label: 'About', hover: 'MEET THE ATELIER' },
  { className: 'nl3', href: '/celebrations', label: 'Celebrations', hover: 'SEE THE WORK' },
  { className: 'nl4', href: '/disciplines', label: 'Disciplines', hover: 'FIVE, AS ONE' },
  { className: 'bl5', href: '/gallery', label: 'Gallery', hover: 'VIEW THE WORK' },
  { className: 'nl6', href: 'mailto:enquiries@woweventsandweddings.com', label: 'Enquiries', hover: 'START A CONVERSATION' },
]

/** Repeat count for each hover marquee panel. */
export const HOVER_REPEAT = 6
