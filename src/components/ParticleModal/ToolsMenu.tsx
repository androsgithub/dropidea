import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Laugh, PaintBucket, RefreshCw, Trash } from 'lucide-react';
import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useInterval } from 'usehooks-ts';
import { useParticles } from '../../hooks/useParticles';
import type { Particle } from '../../types/Particle';
import { Tooltip } from '../Tooltip';

export const ToolsMenu = ({
  isShowingTools,
  setIsShowingTools,
  currentParticle,
  setCurrentParticle,
  updateCurrentParticle
}: {
  isShowingTools: boolean;
  setIsShowingTools: (isShowingTools: boolean) => void;
  currentParticle: Particle | null | undefined;
  setCurrentParticle: (particle: Particle | null) => void;
  updateCurrentParticle: (changes: Partial<Particle>) => Promise<Particle | null>;
}) => {
  const { remove } = useParticles();
  const [isEditingEmoji, setIsEditingEmoji] = useState(false);
  const [color, setColor] = useState(currentParticle?.visual.color);
  const [isEditingColor, setIsEditingColor] = useState(false);
  useInterval(() => setIsShowingTools(false), isShowingTools && !(isEditingColor || isEditingEmoji) ? 5000 : null);

  function removeParticle() {
    if (!currentParticle) return;
    if (confirm(`Quer mesmo deletar a particula: ${currentParticle.data.title}?`)) {
      remove(currentParticle.data.id);
      setCurrentParticle(null);
    }
  }

  function onEmojiClick(e: EmojiClickData) {
    if (!currentParticle) return;
    currentParticle.visual.icon = e.emoji;
    updateCurrentParticle(currentParticle);
    setIsEditingEmoji(false);
  }
  function onColorChange() {
    if (!currentParticle) return;
    currentParticle.visual.color = color ?? '#ffffff';
    updateCurrentParticle(currentParticle);
  }

  return (
    <motion.div
      className="absolute bottom-full m-2 grid w-max grid-cols-1 gap-1 sm:grid-cols-2"
      animate={{
        y: isShowingTools ? 0 : 128,
        scale: isShowingTools ? 1 : 0,
        scaleX: isShowingTools ? 1 : 0,
        opacity: isShowingTools ? 1 : 0,
        skewX: isShowingTools ? 0 : 32
      }}
      transition={{ duration: 0.75, type: 'spring' }}
    >
      <Tooltip content="Excluir" color="#fb2c36">
        <button
          onClick={removeParticle}
          className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-red-500/2.5 bg-red-500/25 text-red-500"
        >
          <Trash size={16} />
        </button>
      </Tooltip>
      <Tooltip content="Sincronizar" color="#2b7fff">
        <button className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-blue-500/1.5 bg-blue-500/25 text-blue-500">
          <RefreshCw size={16} />
        </button>
      </Tooltip>
      <Tooltip content="Icone" color="#00c951">
        <button
          className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-green-500/1.5 bg-green-500/25 text-green-500"
          onClick={() => {
            setIsEditingEmoji((prev) => !prev);
            setIsEditingColor(false);
          }}
        >
          <Laugh size={16} />
        </button>
        <AnimatePresence>
          {isEditingEmoji && (
            <motion.div
              initial={{
                width: 0,
                opacity: 0,
                pointerEvents: 'none'
              }}
              animate={{
                width: 'auto',
                opacity: 1,
                pointerEvents: 'auto'
              }}
              exit={{
                width: 0,
                opacity: 0,
                pointerEvents: 'none'
              }}
              transition={{ duration: 0.75, type: 'spring' }}
              className="absolute top-0 left-14 z-900 overflow-hidden"
            >
              <EmojiPicker width={300} height={400} theme={Theme.DARK} onEmojiClick={onEmojiClick} lazyLoadEmojis />
            </motion.div>
          )}
        </AnimatePresence>
      </Tooltip>
      <Tooltip content="Cor" color="#FFFFFF">
        <button
          className="flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/1.5 bg-white/25 text-white"
          onClick={() => setIsEditingColor((prev) => !prev)}
        >
          <PaintBucket size={16} />
        </button>
        <motion.div
          animate={{
            width: isEditingColor ? 'auto' : 0,
            height: isEditingColor ? 'auto' : 0,
            opacity: isEditingColor ? 1 : 0,
            pointerEvents: isEditingColor ? 'auto' : 'none'
          }}
          transition={{ duration: 0.75, type: 'spring' }}
          className="absolute top-0 left-14 z-900 overflow-hidden"
        >
          <HexColorPicker color={currentParticle?.visual.color} onChange={setColor} onMouseUp={onColorChange} />
        </motion.div>
      </Tooltip>
    </motion.div>
  );
};
