import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

type ButtonProps = (ButtonHTMLAttributes<HTMLButtonElement> | AnchorHTMLAttributes<HTMLAnchorElement>) & {
  href?: string;
  variant?: 'primary' | 'secondary' | 'text';
};

const styles = {
  primary: 'bg-accent text-white hover:bg-[#214b43]',
  secondary: 'border border-border bg-transparent text-ink hover:border-accent hover:text-accent',
  text: 'text-accent underline-offset-4 hover:underline',
};

export function Button({ className = '', variant = 'primary', href, ...props }: ButtonProps) {
  const classes = `inline-flex min-h-12 items-center justify-center rounded-sm px-5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${styles[variant]} ${className}`;
  return href ? <Link href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} /> : <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
