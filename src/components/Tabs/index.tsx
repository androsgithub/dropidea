import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { createContext, useContext, useState, type ReactNode } from 'react';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | null>(null);
const useTabs = () => useContext(TabsContext)!;

type TabsProps = { children: ReactNode };
export function Tabs({ children }: TabsProps) {
  const [activeTab, setActiveTab] = useState('home');

  const rootVariants: Variants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <AnimatePresence mode="wait">
        <motion.div
          variants={rootVariants}
          initial="initial"
          animate="animate"
          exit="initial"
          className="flex flex-col gap-2 md:max-w-4xl md:min-w-xl"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </TabsContext.Provider>
  );
}

type TabListProps = { children: ReactNode };
export const TabList = ({ children }: TabListProps) => (
  <motion.div
    layout
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className="flex flex-col rounded-2xl bg-neutral-100/5 p-4 backdrop-blur-xl md:min-w-lg"
  >
    {children}
  </motion.div>
);

type TabButtonsProps = { children: ReactNode };
export const TabButtons = ({ children }: TabButtonsProps) => (
  <motion.div layout className="flex gap-2">
    {children}
  </motion.div>
);

type TabProps = { children: ReactNode; id: string };
export const Tab = ({ children, id }: TabProps) => {
  const { activeTab } = useTabs();
  return (
    <>
      {activeTab === id && (
        <div key={id} className="flex flex-1 flex-col md:min-w-lg">
          {children}
        </div>
      )}
    </>
  );
};

type TabButtonProps = { children: ReactNode; id?: string; onClick?: () => void };
export const TabButton = ({ children, id = '', onClick = () => {} }: TabButtonProps) => {
  const { activeTab, setActiveTab } = useTabs();

  const tabButtonVariants: Variants = {
    initial: { scale: 0.5, opacity: 0, filter: 'brightness(100%)', y: 32 },
    animate: { scale: 1, opacity: 1, y: 0 },
    whileHover: { scale: 1.05, filter: 'brightness(150%)', y: -4 },
    whileTap: { scaleX: 1.1, scaleY: 0.9, opacity: 1, y: 0 }
  };

  const isActive = activeTab === id;

  return (
    <motion.button
      variants={tabButtonVariants}
      initial="initial"
      animate="animate"
      exit="initial"
      whileHover="whileHover"
      whileTap="whileTap"
      transition={{
        duration: 0.1,
        bounce: 1
      }}
      type="button"
      onClick={() => {
        setActiveTab(id);
        onClick();
      }}
      className={`flex cursor-pointer gap-2 rounded-2xl px-4 py-2 transition-colors ${
        isActive ? 'bg-neutral-900' : 'bg-neutral-950 text-neutral-500'
      }`}
    >
      {children}
    </motion.button>
  );
};
