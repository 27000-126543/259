import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-amber-100 text-amber-800',
      danger: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: '保障中' },
    pending: { variant: 'warning', label: '待生效' },
    expired: { variant: 'default', label: '已过期' },
    cancelled: { variant: 'danger', label: '已取消' },
    reviewing: { variant: 'warning', label: '审核中' },
    approved: { variant: 'info', label: '已通过' },
    rejected: { variant: 'danger', label: '已拒绝' },
    paid: { variant: 'success', label: '已赔付' }
  };
  return statusMap[status] || { variant: 'default', label: status };
};

export const getMemberLevelInfo = (level: string) => {
  const levelMap: Record<string, { label: string; color: string; bgColor: string }> = {
    silver: { label: '银卡会员', color: 'text-gray-600', bgColor: 'bg-gradient-to-r from-gray-300 to-gray-400' },
    gold: { label: '金卡会员', color: 'text-amber-700', bgColor: 'bg-gradient-to-r from-amber-400 to-amber-500' },
    diamond: { label: '钻石会员', color: 'text-blue-700', bgColor: 'bg-gradient-to-r from-blue-400 to-cyan-400' }
  };
  return levelMap[level] || levelMap.silver;
};
