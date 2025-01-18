import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
import { Button } from 'shadcn/ui/button';
import { Icon } from 'shadcn/ui/icon';

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export function SendButton({ show, isStreaming, onClick }: SendButtonProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="absolute top-[18px] right-[22px]"
          transition={{ ease: customEasingFn, duration: 0.17 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <Button
            className="flex justify-center items-center p-1 bg-accent-500 hover:brightness-94 text-white rounded-md w-[34px] h-[34px] transition-theme"
            onClick={(event) => {
              event.preventDefault();
              onClick?.(event);
            }}
          >
            <Icon name={!isStreaming ? 'arrow-right' : 'stop-circle-bold'} className="text-lg" />
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
