import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown';

import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { useGlobalStore } from '../../stores/useGlobalStore';
import type { Particle } from '../../types/Particle';

export function ParticleInsight({ currentParticle }: { currentParticle: Particle }) {
  const updateParticle = useGlobalStore((state) => state.updateParticle);
  const [loading, setLoading] = useState(false);
  async function generateInsight() {
    setLoading(true);
    const _tempParticle = currentParticle;
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Analise os dados fornecidos e desenvolva uma apresentação completa e estruturada da ideia:

**Dados de entrada:** ${JSON.stringify(_tempParticle)}

**Formato solicitado:**
- Documento em Markdown completo e bem formatado
- Estrutura hierárquica clara com títulos e subtítulos
- Seções visuais incluindo diagramas, tabelas e listas
- Plano de ação detalhado com passos práticos
- Elementos visuais como ícones, separadores e boxes destacados

**Estrutura esperada:**
1. **Visão Geral** - Resumo executivo da ideia
2. **Contexto e Problema** - Situação atual e desafios
3. **Solução Proposta** - Descrição detalhada da ideia
4. **Plano de Implementação** - Passos práticos e cronograma
5. **Recursos Necessários** - Lista de requisitos
6. **Resultados Esperados** - Métricas e benefícios
7. **Riscos e Mitigações** - Análise de possíveis obstáculos

**Instruções específicas:**
- Use formatação rica em Markdown (tabelas, listas, código, citações)
- Inclua emojis e ícones para melhorar a visualização
- Crie seções bem delimitadas com separadores visuais
- Adicione boxes de destaque para informações importantes
- Mantenha linguagem clara e objetiva
- Foque em actionable insights e passos concretos

**IMPORTANTE:** Retorne o conteúdo diretamente formatado em Markdown (não dentro de blocos de código). A resposta deve começar imediatamente com o título principal usando # e seguir toda a formatação Markdown normalmente, como se fosse um documento pronto para ser renderizado.`
            }
          ]
        }
      ]
    };

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    const content = data['candidates'][0]['content']['parts'][0]['text'];
    _tempParticle.data.insight = content;
    updateParticle(_tempParticle);

    setLoading(false);
    return data;
  }
  function removeInsight() {
    if (confirm('Deseja remover esse insight?')) {
      currentParticle.data.insight = '';
      updateParticle(currentParticle);
    }
  }
  return (
    <motion.div>
      {loading ? (
        <div className="flex size-full cursor-pointer flex-col items-center justify-center rounded bg-white/5 p-8 font-semibold text-neutral-500 transition-all">
          <p>Carregando.....</p>
        </div>
      ) : currentParticle.data.insight ? (
        <div className="flex h-full max-h-124 flex-col gap-2 overflow-auto">
          <div className="prose-sm prose prose-invert scrollbar-float max-w-[125ch] overflow-auto p-4">
            <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[remarkGfm]}>
              {currentParticle.data.insight}
            </Markdown>
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={removeInsight}
              className="flex-1 cursor-pointer rounded-xl bg-neutral-100/5 p-2 transition-all hover:bg-neutral-100/5"
            >
              Remover
            </button>
            <button
              type="button"
              onClick={generateInsight}
              className="flex-1 cursor-pointer rounded-xl bg-neutral-100/5 p-2 transition-all hover:bg-neutral-100/5"
            >
              Gerar novamente
            </button>
          </div>
        </div>
      ) : (
        <button
          className="flex size-full cursor-pointer flex-col items-center justify-center rounded bg-transparent p-8 font-semibold text-neutral-500 transition-all hover:bg-white/5"
          onClick={generateInsight}
        >
          <Sparkles size={64} strokeWidth={1} />
          <p>Gerar Insight</p>
        </button>
      )}
    </motion.div>
  );
}
