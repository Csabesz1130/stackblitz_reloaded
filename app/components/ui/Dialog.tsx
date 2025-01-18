import { Dialog as ShadcnDialog, DialogContent, DialogDescription as ShadcnDialogDescription, DialogTitle as ShadcnDialogTitle, DialogTrigger, DialogClose } from 'shadcn/ui/dialog';
import { motion, type Variants } from 'framer-motion';
import React, { memo, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { IconButton } from './IconButton';

const transition = {
  duration: 0.15,
  ease: cubicEasingFn,
};

export const dialogBackdropVariants = {
  closed: {
    opacity: 0,
    transition,
  },
  open: {
    opacity: 1,
    transition,
  },
} satisfies Variants;

export const dialogVariants = {
  closed: {
    x: '-50%',
    y: '-40%',
    scale: 0.96,
    opacity: 0,
    transition,
  },
  open: {
    x: '-50%',
    y: '-50%',
    scale: 1,
    opacity: 1,
    transition,
  },
} satisfies Variants;

interface DialogButtonProps {
  type: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  onClick?: (event: React.UIEvent) => void;
}

export const DialogButton = memo(({ type, children, onClick }: DialogButtonProps) => {
  return (
    <button
      className={classNames(
        'inline-flex h-[35px] items-center justify-center rounded-lg px-4 text-sm leading-none focus:outline-none',
        {
          'bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text hover:bg-bolt-elements-button-primary-backgroundHover':
            type === 'primary',
          'bg-bolt-elements-button-secondary-background text-bolt-elements-button-secondary-text hover:bg-bolt-elements-button-secondary-backgroundHover':
            type === 'secondary',
          'bg-bolt-elements-button-danger-background text-bolt-elements-button-danger-text hover:bg-bolt-elements-button-danger-backgroundHover':
            type === 'danger',
        },
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

export const DialogTitle = memo(({ className, children, ...props }: ShadcnDialogTitleProps) => {
  return (
    <ShadcnDialogTitle
      className={classNames(
        'px-5 py-4 flex items-center justify-between border-b border-bolt-elements-borderColor text-lg font-semibold leading-6 text-bolt-elements-textPrimary',
        className,
      )}
      {...props}
    >
      {children}
    </ShadcnDialogTitle>
  );
});

export const DialogDescription = memo(({ className, children, ...props }: ShadcnDialogDescriptionProps) => {
  return (
    <ShadcnDialogDescription
      className={classNames('px-5 py-4 text-bolt-elements-textPrimary text-md', className)}
      {...props}
    >
      {children}
    </ShadcnDialogDescription>
  );
});

interface DialogProps {
  children: ReactNode | ReactNode[];
  className?: string;
  onBackdrop?: (event: React.UIEvent) => void;
  onClose?: (event: React.UIEvent) => void;
}

export const Dialog = memo(({ className, children, onBackdrop, onClose }: DialogProps) => {
  return (
    <ShadcnDialog>
      <DialogTrigger asChild>
        <button>Open Dialog</button>
      </DialogTrigger>
      <DialogContent>
        <motion.div
          className={classNames(
            'fixed top-[50%] left-[50%] z-max max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] border border-bolt-elements-borderColor rounded-lg bg-bolt-elements-background-depth-2 shadow-lg focus:outline-none overflow-hidden',
            className,
          )}
          initial="closed"
          animate="open"
          exit="closed"
          variants={dialogVariants}
        >
          {children}
          <DialogClose asChild onClick={onClose}>
            <IconButton icon="i-ph:x" className="absolute top-[10px] right-[10px]" />
          </DialogClose>
        </motion.div>
      </DialogContent>
    </ShadcnDialog>
  );
});
