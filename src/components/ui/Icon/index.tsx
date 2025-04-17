import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopIcon,
  CheckStatusOffIcon,
  CheckStatusOnIcon,
  CloseIcon,
  DeleteIcon,
  InfoIcon,
  KakaoIcon,
  RefreshIcon,
  SchoolIcon,
  SettingIcon,
} from './icons';

export type IconType =
  | 'delete'
  | 'school'
  | 'check-status-on'
  | 'check-status-off'
  | 'arrow-right'
  | 'arrow-left'
  | 'close'
  | 'arrow-down'
  | 'info'
  | 'setting'
  | 'refresh'
  | 'arrow-top'
  | 'kakao';

const iconMapping = {
  delete: DeleteIcon,
  school: SchoolIcon,
  'check-status-on': CheckStatusOnIcon,
  'check-status-off': CheckStatusOffIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-left': ArrowLeftIcon,
  close: CloseIcon,
  'arrow-down': ArrowDownIcon,
  info: InfoIcon,
  setting: SettingIcon,
  refresh: RefreshIcon,
  'arrow-top': ArrowTopIcon,
  kakao: KakaoIcon,
} as const;

interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
  className?: string;
}

export const Icon = ({ name, size = 24, color, className }: IconProps) => {
  console.log(name);
  const icons = iconMapping as Record<
    IconType,
    React.FC<{ width: number; height: number; color?: string; className?: string }>
  >;

  const IconComponent = icons[name];

  if (!IconComponent) {
    throw new Error(`아이콘 "${name}"을(를) 찾을 수 없습니다.`);
  }

  return <IconComponent width={size} height={size} color={color} className={className} />;
};
