import { DeleteIcon } from './icons';
import { SchoolIcon } from './icons';

export type IconType = 'delete' | 'school';

interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon = ({ name, size = 24, color, className }: IconProps) => {
  const icons = {
    delete: DeleteIcon,
    school: SchoolIcon,
  } as Record<IconType, React.FC<{ width: number; height: number; color?: string; className?: string }>>;

  const IconComponent = icons[name];

  return <IconComponent width={size} height={size} color={color} className={className} />;
};
