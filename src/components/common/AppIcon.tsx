import React from 'react';
import * as LucideIcons from 'lucide-react';

interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.FolderArchive;

  return <IconComponent className={className} size={size} />;
};
