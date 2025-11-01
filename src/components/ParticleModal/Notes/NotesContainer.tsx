import { Plus, Search, X, type LucideProps } from 'lucide-react';
import { useState } from 'react';
import { useCurrentParticle } from '../../../hooks/useCurrentParticle';
import type { Note, Particle } from '../../../types/Particle';
import { Pagination } from '../../Pagination';
import { NoteModal } from './NoteModal';

type NotesContainerProps = {
  setCurrentTab: (
    tab: {
      id: string;
      title: string;
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
    } | null
  ) => void;
  updateCurrentParticle: (changes: Partial<Particle>) => Promise<Particle | null>;
};
export function NotesContainer({ setCurrentTab, updateCurrentParticle }: NotesContainerProps) {
  const { currentParticle } = useCurrentParticle();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isCreatingNewNote, setIsCreatingNewNote] = useState(false);

  const maxItems = 5;
  const totalPages = Math.ceil((currentParticle?.data?.notes?.length ?? 0) / maxItems);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  function onPageChange(page: number) {
    goToPage(page);
  }

  return (
    <>
      <NoteModal
        currentNote={currentNote}
        isOpen={currentNote != null || isCreatingNewNote}
        setCurrentNote={setCurrentNote}
        setIsCreatingNewNote={setIsCreatingNewNote}
        updateCurrentParticle={updateCurrentParticle}
      />
      <div className="relative flex items-center justify-between px-4 pt-4">
        {currentParticle?.data.notes?.length && currentParticle?.data.notes?.length > 0 ? (
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-white/5 p-2 px-4 text-sm">
            <Search size={16} className="text-neutral-600" />
            <input type="text" className="outline-0" />
          </div>
        ) : (
          <div />
        )}
        <button
          className="top-4 right-4 flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          style={{
            position: (currentParticle?.data?.notes?.length ?? 0 > 0) ? 'relative' : 'absolute',
            top: (currentParticle?.data?.notes?.length ?? 0 > 0) ? 0 : '1rem',
            right: (currentParticle?.data?.notes?.length ?? 0 > 0) ? 0 : '1rem'
          }}
          onClick={() => setCurrentTab(null)}
        >
          <X size={20} />
        </button>
      </div>
      <div className="scrollbar-float m-2 p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-32 cursor-pointer items-center justify-center rounded-xl bg-white/2.5 text-neutral-700 outline outline-white/5 transition-all hover:bg-white/5"
            onClick={() => setIsCreatingNewNote(true)}
          >
            <Plus />
          </button>

          {currentParticle?.data?.notes
            ?.slice((currentPage - 1) * maxItems, (currentPage - 1) * maxItems + maxItems)
            ?.map((note) => (
              <button
                key={note.id}
                className="scrollbar-float flex h-32 cursor-pointer resize-none overflow-y-scroll rounded-xl bg-white/2.5 p-3 text-start text-xs wrap-anywhere text-neutral-400 outline outline-white/5 transition-all hover:bg-white/5"
                onClick={() => setCurrentNote(note)}
              >
                {note.text}
              </button>
            ))}
        </div>
      </div>
      <div className="mx-2 mb-2 flex items-center justify-between p-2 pt-0">
        <p className="text-xs font-semibold text-neutral-500">{currentParticle?.data.notes.length} Nota(s)</p>
        <Pagination currentPage={currentPage} onPageChange={onPageChange} totalPages={totalPages}></Pagination>
      </div>
    </>
  );
}
