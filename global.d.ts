declare global {
  interface Window {
    Kakao: any;
  }
}

declare module '*.svg' {
  import type { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGElement>>;
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

export {};
