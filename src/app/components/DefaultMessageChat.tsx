import React from 'react';
import Logo from './Logo';
import { ListButtonFeature } from './ListButtonFeature';
import { cn } from '@/app/lib/utils';

type DefaultMessageProps = {
  variant?: "large" | "small";
};

export const DefaultMessage = ({ variant = "large" }: DefaultMessageProps) => {
  const titleClasses =
    variant === "large"
      ? "text-4xl sm:text-5xl lg:text-6xl w-[90%] sm:w-[70%] lg:w-[50%]"
      : "text-2xl sm:text-3xl lg:text-4xl w-[70%]";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-5 sm:gap-12 sm:p-10 lg:gap-16">
      <Logo isClickable={false} size="xl" />
      <h3 className={cn("text-center font-medium text-white", titleClasses)}>
        Simplifiez vos PDF grâce à notre <span className="text-gradient">Agent Autonome</span>
      </h3>
      <ListButtonFeature variant={variant} />
    </div>
  );
};
