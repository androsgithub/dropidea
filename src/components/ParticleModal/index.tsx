import { AnimatePresence, motion } from 'framer-motion';
import { CloudAlert, Pencil, type LucideProps } from 'lucide-react';
import { useState } from 'react';
import { useCurrentParticle } from '../../hooks/useCurrentParticle';
import { opacityVariants } from '../../motion-variants/common';
import { Tooltip } from '../Tooltip';
import { EditDescriptionModal } from './EditDescriptionModal';
import { EditTitleModal } from './EditTitleModal';
import { InsightsContainer } from './Insights/InsightsContainer';
import { NotesContainer } from './Notes/NotesContainer';
import { ParticleButton } from './ParticleButton';
import { TabsSection } from './TabsSection';
import { TagsSection } from './Tags';
import { TasksContainer } from './Tasks/TasksContainer';
import { ToolsMenu } from './ToolsMenu';

export const ParticleModal = () => {
  const {
    currentParticle,
    setCurrentParticle,
    updateCurrentParticle,
    setGeneratingInsight,
    updateInsightInCurrentParticle
  } = useCurrentParticle();

  const [currentTab, setCurrentTab] = useState<{
    id: string;
    title: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
  } | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isShowingTools, setIsShowingTools] = useState(false);

  const tabsVariantsContainer = {
    initial: {
      opacity: 0,
      height: '0',
      marginTop: 0
    },
    animate: {
      opacity: 1,
      height: 'auto',
      marginTop: 16
    },
    exit: {
      opacity: 0,
      height: '0',
      marginTop: 0
    }
  };

  return (
    <AnimatePresence propagate>
      {currentParticle && (
        <>
          <EditTitleModal
            isOpen={isEditingTitle}
            onClose={() => setIsEditingTitle(false)}
            currentParticle={currentParticle}
            updateCurrentParticle={updateCurrentParticle}
          />
          <EditDescriptionModal
            isOpen={isEditingDescription}
            onClose={() => setIsEditingDescription(false)}
            currentParticle={currentParticle}
            updateCurrentParticle={updateCurrentParticle}
          />
          <motion.div
            variants={opacityVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-neutral-950/75 backdrop-blur-xl transition-all"
            onClick={() => {
              setIsShowingTools(false);
              setCurrentTab(null);
              if (!currentTab) setCurrentParticle(null);
            }}
          >
            <div className="flex w-full max-w-xl flex-col p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
              <motion.div
                className="relative z-1000 flex max-w-xl gap-4"
                initial={{ scale: 0.75, opacity: 0, position: 'relative' }}
                animate={{
                  scale: currentTab ? 0.5 : 1,
                  opacity: currentTab ? 0 : 1,
                  filter: currentTab ? 'blur(12px) brightness(50%)' : 'blur(0px) brightness(100%)',
                  height: currentTab ? 0 : 'auto',
                  pointerEvents: currentTab ? 'none' : 'all'
                }}
                exit={{ scale: 0.75, opacity: 0, position: 'relative' }}
                transition={{ duration: 0.75, type: 'spring' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative flex items-center justify-center">
                    <ParticleButton
                      color={currentParticle.visual.color}
                      icon={currentParticle.visual.icon}
                      onClick={() => setIsShowingTools((prev) => !prev)}
                    />

                    <ToolsMenu
                      isShowingTools={isShowingTools}
                      setIsShowingTools={setIsShowingTools}
                      currentParticle={currentParticle}
                      setCurrentParticle={setCurrentParticle}
                      updateCurrentParticle={updateCurrentParticle}
                    />
                  </div>
                  <AlertIcon />
                </div>
                {/* Direita */}
                <div className="flex flex-1 flex-col gap-2">
                  <TitleSection title={currentParticle.data.title} setIsEditingTitle={setIsEditingTitle} />
                  <DescriptionSection
                    description={currentParticle.data.description}
                    setIsEditingDescription={setIsEditingDescription}
                  />
                  <TagsSection currentParticle={currentParticle} updateCurrentParticle={updateCurrentParticle} />
                </div>
              </motion.div>
              <div className="w-full flex-1">
                <TabsSection currentTab={currentTab} setCurrentTab={setCurrentTab} currentParticle={currentParticle} />
                <AnimatePresence mode="sync">
                  {currentTab && (
                    <motion.div
                      key={currentTab.id}
                      variants={tabsVariantsContainer}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      layout
                      transition={{ duration: 0.25, type: 'spring', stiffness: 1000, damping: 100, mass: 1 }}
                      className="z-5000 size-full flex-1 origin-top overflow-hidden rounded-2xl border border-white/2 bg-neutral-900 backdrop-blur-3xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {currentTab?.id == 'notes' && (
                        <NotesContainer
                          key={currentTab?.id}
                          setCurrentTab={setCurrentTab}
                          updateCurrentParticle={updateCurrentParticle}
                        />
                      )}
                      {currentTab?.id == 'insights' && (
                        <InsightsContainer
                          key={currentTab?.id}
                          setCurrentTab={setCurrentTab}
                          currentParticle={currentParticle}
                          setGeneratingInsight={setGeneratingInsight}
                          updateInsightInCurrentParticle={updateInsightInCurrentParticle}
                          setCurrentParticle={setCurrentParticle}
                        />
                      )}
                      {currentTab?.id == 'tasks' && (
                        <TasksContainer
                          key={currentTab?.id}
                          setCurrentTab={setCurrentTab}
                          currentParticle={currentParticle}
                          updateCurrentParticle={updateCurrentParticle}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const TitleSection = ({
  title,
  setIsEditingTitle
}: {
  title: string;
  setIsEditingTitle: (editing: boolean) => void;
}) => (
  <div className="flex gap-1">
    <div className="line-clamp-1 h-min max-w-[calc(100%-2.5rem)] rounded-xl bg-white/5 p-1 px-2">{title}</div>
    <Tooltip content="Editar" color="#ffffff">
      <button
        className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/2 bg-white/10 text-white/75"
        onClick={() => setIsEditingTitle(true)}
      >
        <Pencil size={16} />
      </button>
    </Tooltip>
  </div>
);

export const DescriptionSection = ({
  description,
  setIsEditingDescription
}: {
  description?: string;
  setIsEditingDescription: (editing: boolean) => void;
}) => (
  <div className="flex gap-1">
    <div className="line-clamp-3 max-w-[calc(100%-2.5rem)] items-center rounded-xl border border-white/2 bg-white/5 p-1 px-3 text-sm text-white/50">
      {description || 'Sem descrição'}
    </div>
    <Tooltip content="Editar" color="#ffffff">
      <button
        className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-white/2 bg-neutral-700/50"
        onClick={() => setIsEditingDescription(true)}
      >
        <Pencil size={16} />
      </button>
    </Tooltip>
  </div>
);

export const AlertIcon = () => (
  <Tooltip content="Não sincronizado" color="#fb2c36">
    <div className="flex size-8 items-center justify-center rounded-full bg-red-500">
      <CloudAlert size={20} />
    </div>
  </Tooltip>
);
