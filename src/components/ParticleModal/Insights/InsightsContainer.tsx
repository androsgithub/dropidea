import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, LoaderCircle, Search, Sparkles, Trash, X, type LucideProps } from 'lucide-react';
import { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { useInterval, useLocalStorage } from 'usehooks-ts';
import type { Particle } from '../../../types/Particle';
import { Pagination } from '../../Pagination';

type InsightsContainerProps = {
  setCurrentTab: (
    tab: {
      id: string;
      title: string;
      icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
    } | null
  ) => void;
  currentParticle: Particle | null | undefined;
  setGeneratingInsight: (generating: boolean) => Promise<Particle | null | undefined>;
  updateInsightInCurrentParticle: (insight: string | string[]) => Promise<Particle | null | undefined>;
};
export function InsightsContainer({
  setCurrentTab,
  currentParticle,
  setGeneratingInsight,
  updateInsightInCurrentParticle
}: InsightsContainerProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const maxItems = 8;
  const totalPages = Math.ceil(
    (currentParticle?.data?.insight
      ? Array.isArray(currentParticle.data.insight)
        ? currentParticle.data.insight
        : [currentParticle.data.insight]
      : []
    ).length / maxItems
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  function onPageChange(page: number) {
    goToPage(page);
  }

  const [loading, setLoading] = useState(currentParticle?.states.generatingInsight ?? false);
  const [apiKey] = useLocalStorage('GEMINI_API_KEY', '');
  useInterval(
    () => {
      if (!currentParticle) return;
      currentParticle.states.generatingInsight = false;
      setLoading(false);
      setGeneratingInsight(false);
    },
    loading ? 30000 : null
  );
  function deleteCurrentInsight() {
    if (!currentParticle) return;
    if (Array.isArray(currentParticle.data.insight)) {
      if (confirm('Deseja mesmo deletar esse Insight?')) {
        updateInsightInCurrentParticle(
          currentParticle.data.insight.filter((_, index) => index !== currentInsightIndex)
        );
        setCurrentInsightIndex(null);
      }
    }
  }

  async function generateInsight() {
    if (!currentParticle) return;
    if (currentParticle?.states.generatingInsight) return;
    if (apiKey == '') return;

    setLoading(true);
    setGeneratingInsight(true);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
    const inputData = { ...currentParticle, data: { ...currentParticle.data, insight: [] } };
    const body = {
      contents: [
        {
          parts: [
            {
              text: `Analise os dados fornecidos e desenvolva uma apresentação completa e estruturada da ideia:
                     Dados de entrada: ${JSON.stringify(inputData)}

                     Formato solicitado:
                     - Documento em Markdown completo e bem formatado
                     - Estrutura hierárquica clara com títulos e subtítulos
                     - Seções visuais incluindo diagramas, tabelas e listas
                     - Plano de ação detalhado com passos práticos
                     - Elementos visuais como ícones, separadores e boxes destacados

                     Estrutura esperada:
                     1. Visão Geral - Resumo executivo da ideia
                     2. Contexto e Problema - Situação atual e desafios
                     3. Solução Proposta - Descrição detalhada da ideia
                     4. Plano de Implementação - Passos práticos e cronograma
                     5. Recursos Necessários - Lista de requisitos
                     6. Resultados Esperados - Métricas e benefícios
                     7. Riscos e Mitigações - Análise de possíveis obstáculos

                     Instruções específicas:
                     - Use formatação rica em Markdown (tabelas, listas, código, citações)
                     - Inclua emojis e ícones para melhorar a visualização
                     - Crie seções bem delimitadas com separadores visuais
                     - Adicione boxes de destaque para informações importantes
                     - Mantenha linguagem clara e objetiva
                     - Foque em actionable insights e passos concretos

                     IMPORTANTE: Retorne o conteúdo diretamente formatado em Markdown (não dentro de blocos de código). A resposta deve começar imediatamente com o título principal usando # e seguir toda a formatação Markdown normalmente, como se fosse um documento pronto para ser renderizado.`
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
    const insights = [];
    if (Array.isArray(currentParticle.data.insight)) {
      insights.push(content);
    } else {
      if (currentParticle.data.insight == '') {
        insights.push(content);
      } else {
        insights.push(currentParticle.data.insight);
        insights.push(content);
      }

      updateInsightInCurrentParticle(insights);
    }
    setGeneratingInsight(false);
    setLoading(false);
  }
  if (currentInsightIndex != null)
    return (
      <div className="p-4 pt-2">
        <div className="flex h-full max-h-124 flex-col gap-2 overflow-auto">
          <div className="flex flex-1 items-center justify-between p-2">
            <button
              className="flex cursor-pointer items-center justify-center gap-2 rounded-full p-2 px-4 hover:bg-white/5"
              onClick={() => setCurrentInsightIndex(null)}
            >
              <ArrowLeft size={20} /> Voltar
            </button>

            <button
              className="group flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-red-500/10 p-2 text-red-500 outline outline-red-500/15 brightness-100 transition-all hover:brightness-125"
              onClick={deleteCurrentInsight}
            >
              <Trash size={16} />
            </button>
          </div>
          <div className="prose-sm prose prose-invert scrollbar-float max-w-[calc(100dvw-4rem)] overflow-auto p-4 md:max-w-[125ch]">
            <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]} remarkPlugins={[remarkGfm]}>
              {
                [
                  ...(Array.isArray(currentParticle?.data.insight)
                    ? currentParticle.data.insight
                    : currentParticle?.data.insight
                      ? [currentParticle.data.insight]
                      : [])
                ][currentInsightIndex]
              }
            </Markdown>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-white/5 p-2 px-4 text-sm">
          <Search size={16} className="text-neutral-600" />
          <input type="text" className="outline-0" />
        </div>
        <button
          className="flex cursor-pointer items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/5"
          onClick={() => setCurrentTab(null)}
        >
          <X size={20} />
        </button>
      </div>
      <div className="scrollbar-float m-2 p-2">
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            <div className="grid grid-cols-3 gap-2">
              <button
                className="flex aspect-square h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/2.5 p-8 font-semibold text-neutral-400 opacity-100 outline outline-white/5 transition-all hover:bg-white/5 disabled:pointer-events-none disabled:opacity-25"
                onClick={generateInsight}
                disabled={currentParticle?.states.generatingInsight}
              >
                {currentParticle?.states.generatingInsight ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                  </>
                ) : (
                  <>
                    <Sparkles size={24} strokeWidth={1.5} />
                    Gerar
                  </>
                )}
              </button>
              {[
                ...(Array.isArray(currentParticle?.data.insight)
                  ? currentParticle.data.insight
                  : currentParticle?.data.insight
                    ? [currentParticle.data.insight]
                    : [])
              ]
                ?.slice((currentPage - 1) * maxItems, (currentPage - 1) * maxItems + maxItems)
                ?.map((_, i) => (
                  <button
                    className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-white/2.5 p-8 font-semibold text-neutral-400 outline outline-white/5 transition-all hover:bg-white/5"
                    onClick={() => {
                      setCurrentInsightIndex(i + (currentPage - 1) * maxItems);
                    }}
                  >
                    Insight {i + (currentPage - 1) * maxItems + 1}
                  </button>
                ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mx-2 mb-2 flex items-center justify-between p-2 pt-0">
        <p className="text-xs font-semibold text-neutral-500">
          {
            [
              ...(Array.isArray(currentParticle?.data.insight)
                ? currentParticle.data.insight
                : currentParticle?.data.insight
                  ? [currentParticle.data.insight]
                  : [])
            ].length
          }{' '}
          Insight(s)
        </p>
        <Pagination currentPage={currentPage} onPageChange={onPageChange} totalPages={totalPages}></Pagination>
      </div>
    </>
  );
}
