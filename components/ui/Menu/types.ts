// components/ui/Menu/types.ts
export interface MenuItemProps {
  label: string;
  onClick?: () => void;
  color?: string;
  icon?: React.ReactNode;
}

export interface MenuProps {
  items: MenuItemProps[];
}
