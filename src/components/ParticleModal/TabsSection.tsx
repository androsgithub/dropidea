import { motion } from 'framer-motion';
import { ListTodo, Notebook, Sparkles, type LucideProps } from 'lucide-react';
import { useGlobalStore } from '../../stores/useGlobalStore';

type TabsSection = {
  currentTab: {
    id: string;
    title: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  } | null;
  setCurrentTab: React.Dispatch<
    React.SetStateAction<{
      id: string;
      title: string;
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
    } | null>
  >;
};
export const TabsSection = ({ currentTab, setCurrentTab }: TabsSection) => {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const tabs = [
    {
      id: 'tasks',
      title: 'Tasks',
      icon: ListTodo,
      sizeText: currentParticle
        ? (currentParticle?.data?.tasks?.length ?? 1 > 0)
          ? `${currentParticle?.data.tasks?.filter((t) => t.done).length}/${currentParticle?.data.tasks?.length}`
          : 0
        : null
    },
    {
      id: 'notes',
      title: 'Notes',
      icon: Notebook,
      sizeText: currentParticle ? currentParticle?.data.notes?.length : null
    },
    {
      id: 'insights',
      title: 'Insights',
      icon: Sparkles,
      sizeText: currentParticle
        ? [
            ...(Array.isArray(currentParticle?.data.insight)
              ? currentParticle.data.insight
              : currentParticle?.data.insight
                ? [currentParticle.data.insight]
                : [])
          ].length
        : null
    }
  ];

  return (
    <div className="top-0 mt-4 flex flex-1 gap-2" onClick={(e) => e.stopPropagation()}>
      {tabs.map((tab) => (
        <motion.button
          onClick={() => setCurrentTab((prev) => (tab?.id == prev?.id ? null : tab))}
          key={tab.id}
          initial={{
            scale: 0,
            opacity: 0,
            flex: 1
          }}
          animate={{
            scale: 1,
            opacity: currentTab?.id == tab.id ? 1 : 0.5,
            flex: currentTab?.id == tab.id ? 3 : 2,
            borderRadius: 16
          }}
          exit={{
            scale: 0,
            opacity: 0,
            flex: 1
          }}
          whileHover={{
            opacity: 1,
            flex: currentTab?.id == tab.id ? 3 : 4,
            scale: 1.05
          }}
          whileTap={{
            scale: currentTab ? 1 : 1.1,
            scaleY: 0.85,
            y: 4
          }}
          className="flex flex-1 cursor-pointer items-center justify-between gap-1 border border-white/2 bg-neutral-900 px-4 py-3 text-xs sm:text-sm"
        >
          <span className="flex items-center justify-between gap-2">
            <tab.icon size={16} /> {tab.title}
          </span>
          <span>{tab.sizeText}</span>
        </motion.button>
      ))}
    </div>
  );
};
