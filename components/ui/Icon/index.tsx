import { ArrowRightIcon, CheckStatusOffIcon, CheckStatusOnIcon, DeleteIcon, SchoolIcon } from './icons';

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
    checkStatusOn: CheckStatusOnIcon,
    checkStatusOff: CheckStatusOffIcon,
    arrowRight: ArrowRightIcon,
  } as Record<IconType, React.FC<{ width: number; height: number; color?: string; className?: string }>>;

  const IconComponent = icons[name];

  if (!IconComponent) {
    throw new Error(`아이콘 "${name}"을(를) 찾을 수 없습니다.`);
  }

  return <IconComponent width={size} height={size} color={color} className={className} />;
};
