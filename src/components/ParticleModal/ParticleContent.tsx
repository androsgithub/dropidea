import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { HexColorPicker } from 'react-colorful';
import { v1 as uuid } from 'uuid';
import type { ParticleData } from '../../types/Particle';

export function ParticleContent({ currentParticle }: { currentParticle: ParticleData }) {
  const [title, setTitle] = useState(currentParticle.title);
  const [description, setDescription] = useState(currentParticle.description);
  const [notes, setNotes] = useState(currentParticle.notes);
  const [emoji, setEmoji] = useState(currentParticle.icon);
  const [color, setColor] = useState(currentParticle.color);

  const [isSelectingEmoji, setIsSelectingEmoji] = useState(false);
  const [isSelectingColor, setIsSelectingColor] = useState(false);
  function onTitleChange(e: ChangeEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value);
  }
  function onDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(e.currentTarget.value);
  }
  function onEmojiClick(e: EmojiClickData) {
    setIsSelectingEmoji(false);
    setEmoji(e.emoji);
  }
  function newNote() {
    setNotes((prev) => [...prev, { id: uuid(), text: '' }]);
  }
  return (
    <motion.div className="flex flex-1 flex-col items-start justify-between p-4">
      <div className="flex w-full flex-1 flex-row items-end justify-between gap-2">
        <div className="w-full flex-1">
          <label htmlFor="newTitle" className="text-sm text-neutral-400">
            Titulo:
          </label>
          <input
            placeholder="Ex: Projeto academia"
            name="newTitle"
            className="w-full rounded-md border p-1 px-2 contrast-100 outline-none focus:contrast-90"
            style={{
              borderColor: `color-mix(in srgb, ${currentParticle.color} 5%,  color-mix(in srgb, transparent 25%, var(--color-neutral-700) 75%) 95%)`,

              backgroundColor: `color-mix(in srgb, ${currentParticle.color} 5%,  color-mix(in srgb, transparent 25%, var(--color-neutral-800) 75%) 95%)`
            }}
            value={title}
            onChange={onTitleChange}
          />
          <input type="hidden" name="icon" value={emoji} />
          <input type="hidden" name="color" value={color} />
        </div>
        <div className="relative">
          <div
            className="flex size-10 cursor-pointer items-center justify-center rounded-2xl border border-neutral-200/10 bg-neutral-200/5 p-1 transition-all hover:scale-115 hover:brightness-115"
            onClick={() => {
              setIsSelectingEmoji((prev) => !prev);
              setIsSelectingColor(false);
            }}
          >
            {emoji ? emoji : '🎨'}
          </div>
          <EmojiPicker
            open={isSelectingEmoji}
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            className="absolute z-900"
            style={{ position: 'absolute' }}
          />
        </div>
        <div className="relative">
          <div
            className="size-10 cursor-pointer rounded-2xl p-1 transition-all hover:scale-115 hover:brightness-115"
            onClick={() => {
              setIsSelectingColor((prev) => !prev);
              setIsSelectingEmoji(false);
            }}
            style={{ backgroundColor: color }}
          />
          <div className={`absolute mt-2 ${!isSelectingColor && 'hidden'} z-900`}>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        </div>
      </div>
      <div className="w-full">
        <label htmlFor="newDescription" className="text-sm text-neutral-400">
          Descrição:
        </label>
        <textarea
          placeholder="Ex: 10 - Agachamentos&#10;      5 - Terra"
          name="newDescription"
          className="w-full resize-none rounded-md border p-1 px-2 contrast-100 outline-none focus:contrast-90"
          style={{
            borderColor: `color-mix(in srgb, ${currentParticle.color} 5%,  color-mix(in srgb, transparent 25%, var(--color-neutral-700) 75%) 95%)`,

            backgroundColor: `color-mix(in srgb, ${currentParticle.color} 5%,  color-mix(in srgb, transparent 25%, var(--color-neutral-800) 75%) 95%)`
          }}
          value={description}
          onChange={onDescriptionChange}
        />
      </div>
      <label className="mb-2 text-sm text-neutral-400">Notas</label>
      <div className="scrollbar-float font-comic-relief grid size-full max-h-72 w-full grid-cols-2 gap-2 overflow-auto">
        {notes.map((n) => (
          <textarea
            key={n.id}
            name={n.id}
            defaultValue={n.text}
            placeholder="Digite algo ou essa nota sera removida"
            className="scrollbar-float flex h-32 flex-1 resize-none flex-col bg-yellow-300 p-2 align-middle text-xs text-neutral-800 transition-all outline-none placeholder-shown:brightness-50 placeholder-shown:saturate-50"
          />
        ))}
        <button
          onClick={newNote}
          type="button"
          className="flex h-32 flex-1 cursor-pointer items-center justify-center bg-yellow-300 p-2 text-yellow-700 transition-all hover:brightness-110"
        >
          <Plus />
        </button>
      </div>
    </motion.div>
  );
}
