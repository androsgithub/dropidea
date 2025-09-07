import { Plus, Save, Trash, X } from 'lucide-react';
import { v1 as uuid } from 'uuid';
import { useGlobalStore } from '../../../stores/useGlobalStore';
import type { Note } from '../../../types/Particle';
import { Modal } from '../../Modal';

type NoteModalProps = {
  isOpen: boolean;
  setIsCreatingNewNote: (isCreatingNewNote: boolean) => void;
  setCurrentNote: (isCreatingNewTask: Note | null) => void;
  currentNote: Note | null;
};
export function NoteModal({ isOpen, setCurrentNote, currentNote, setIsCreatingNewNote }: NoteModalProps) {
  const currentParticle = useGlobalStore((state) => state.currentParticle);
  const updateParticle = useGlobalStore((state) => state.updateParticle);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentParticle) return;
    const formData = new FormData(e.currentTarget);
    const noteText = (formData.get('note-text') as string) ?? '';

    if (noteText != '') {
      const tempNote: Note = {
        id: currentNote?.id ?? uuid(),
        text: noteText
      };
      if (!currentParticle.data.notes) currentParticle.data.notes = [];
      const isAlreadyExist = currentParticle.data.notes.filter((note) => note.id === tempNote.id).length > 0;
      console.log(isAlreadyExist);
      if (isAlreadyExist) {
        currentParticle.data.notes = currentParticle.data.notes?.map((note) => {
          return note.id == tempNote?.id ? tempNote : note;
        });
      } else if (currentParticle?.data.notes.length > 0) {
        currentParticle.data.notes.unshift(tempNote);
      } else {
        currentParticle.data.notes = [tempNote];
      }
      updateParticle(currentParticle);
    }
    closeModal();
  }
  function closeModal() {
    setIsCreatingNewNote(false);
    setCurrentNote(null);
  }
  function deleteCurrentNote() {
    if (!currentParticle) return;
    if (confirm('Deseja remover essa nota?')) {
      currentParticle.data.notes = currentParticle.data.notes.filter((note) => currentNote != note);
      updateParticle(currentParticle);
      closeModal();
    }
  }

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">{currentNote ? 'Editando Nota' : 'Nova nota'}</h1>

          <button
            onClick={() => closeModal()}
            className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          >
            <X size={20} />
          </button>
        </div>
        <p className="py-2 text-sm text-neutral-600">
          {currentNote ? 'Você vai estar modificando o texto de sua nota!' : 'Escreva o texto da nova nota.'}
        </p>
        <textarea
          name="note-text"
          className="scrollbar-float h-32 resize-none rounded-xl bg-white/2.5 p-2 px-4 text-sm outline outline-white/5"
          defaultValue={currentNote?.text}
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            {currentNote && (
              <button
                className="flex size-10 cursor-pointer items-center justify-center rounded-2xl bg-red-500/10 p-2 text-red-500 outline outline-red-500/15 brightness-100 transition-all hover:brightness-125"
                type="button"
                onClick={deleteCurrentNote}
              >
                <Trash size={16} strokeWidth={2} />
              </button>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => closeModal()}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-2 px-4 text-sm font-semibold text-red-500 outline outline-red-500/15 transition-all hover:bg-red-500/15"
            >
              <X size={16} strokeWidth={2} /> Cancelar
            </button>
            {currentNote ? (
              <button
                type="submit"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-500/10 p-2 px-4 text-sm font-semibold text-blue-600 outline outline-blue-500/15 transition-all hover:bg-blue-500/15"
              >
                <Save size={16} strokeWidth={2} /> Salvar
              </button>
            ) : (
              <button
                type="submit"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-green-500/10 p-2 px-4 text-sm font-semibold text-green-600 outline outline-green-500/15 transition-all hover:bg-green-500/15"
              >
                <Plus size={16} strokeWidth={2} /> Adicionar
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
