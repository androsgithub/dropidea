import { useState } from 'react';
import { MenuContent } from './MenuContent';
import { MenuTrigger } from './MenuTrigger';

export const ConfigMenu = () => {
  const [opened, setOpened] = useState(false);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const geminiApiKey = (formData.get('gemini-api-key') as string) ?? '';
    localStorage.setItem('GEMINI_API_KEY', geminiApiKey);
    if (formData.get('idea') == '') return;
    setOpened(false);
  }
  return (
    <>
      <MenuTrigger open={opened} setOpened={setOpened} />

      <MenuContent open={opened} handleSubmit={handleSubmit} setOpened={setOpened} />
    </>
  );
};
