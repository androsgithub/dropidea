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
  setCurrentParticle: (particle: Particle | null) => void;
};
export function InsightsContainer({
  setCurrentTab,
  currentParticle,
  setGeneratingInsight,
  updateInsightInCurrentParticle,
  setCurrentParticle
}: InsightsContainerProps) {
  const [currentInsightIndex, setCurrentInsightIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const maxItems = 8;
  const getInsights = () => {
    const v = currentParticle?.data?.insight;
    if (!v) return [] as string[];
    return Array.isArray(v) ? v : [v];
  };

  const totalPages = Math.max(1, Math.ceil(getInsights().length / maxItems));

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
      // Ensure external state updated if something stalled server-side
      setLoading(false);
      void setGeneratingInsight(false);
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
    void setGeneratingInsight(true);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

      const prompt = `Analise profundamente os dados fornecidos e desenvolva uma apresentação estratégica completa, clara e visualmente estruturada da ideia descrita.

📥 Dados de entrada

Fonte principal:
${JSON.stringify(currentParticle)}

Utilize 100% das informações relevantes presentes nos dados de entrada, inferindo detalhes apenas quando necessário e deixando explícitas quaisquer suposições feitas.

🎯 Objetivo do Documento

Criar um documento em Markdown pronto para apresentação, com nível executivo e técnico, capaz de ser utilizado como:

Proposta de projeto

Documento de visão de produto

Planejamento estratégico

Base para pitch, roadmap ou documentação interna

📄 Formato e Regras Gerais

Retorne exclusivamente conteúdo em Markdown

NÃO utilize blocos de código para encapsular o documento

O conteúdo deve começar imediatamente com um título principal (#)

Linguagem clara, objetiva e profissional

Estrutura lógica, progressiva e bem hierarquizada

Foco em insights acionáveis, decisões práticas e clareza estratégica

🧱 Estrutura Obrigatória do Documento
1️⃣ Visão Geral 🚀

Resumo executivo da ideia

Proposta de valor principal

Público-alvo impactado

Objetivo estratégico

2️⃣ Contexto e Problema 🧩

Cenário atual

Principais desafios e dores

Impactos do problema (técnicos, financeiros ou operacionais)

O que acontece se nada for feito

📌 Box de destaque:
Insight-chave ou dor crítica que justifica a solução

3️⃣ Solução Proposta 💡

Descrição detalhada da solução

Componentes principais

Diferenciais competitivos

Como a solução resolve cada problema apresentado

Inclua obrigatoriamente:

Lista de funcionalidades

Fluxo lógico da solução (em formato textual ou diagrama em Markdown)

4️⃣ Plano de Implementação 🛠️

Apresente um plano prático e executável, contendo:

Etapas numeradas

Responsáveis (quando aplicável)

Dependências

Marcos importantes

📆 Cronograma

Utilize uma tabela em Markdown, por exemplo:

Fase	Atividades	Duração Estimada
5️⃣ Recursos Necessários 📦

Liste de forma clara:

Recursos técnicos

Recursos humanos

Ferramentas, tecnologias ou integrações

Custos estimados (se aplicável)

Utilize tabelas sempre que fizer sentido.

6️⃣ Resultados Esperados 📈

Benefícios diretos

Indicadores de sucesso (KPIs)

Métricas mensuráveis

Impactos de curto, médio e longo prazo

✅ Box de sucesso:
O que define que a solução foi bem-sucedida?

7️⃣ Riscos e Mitigações ⚠️

Crie uma análise realista contendo:

Risco	Impacto	Probabilidade	Mitigação

Inclua riscos técnicos, operacionais e estratégicos.

🎨 Diretrizes Visuais Obrigatórias

Use emojis de forma equilibrada para melhorar escaneabilidade

Utilize separadores visuais (---)

Crie boxes de destaque usando:

> 💡 Dica

> ⚠️ Atenção

> 📌 Importante

Use listas, subtítulos e tabelas sempre que possível

Priorize clareza visual e leitura rápida

🧠 Qualidade Esperada

Nível profissional / consultivo

Nenhuma seção superficial

Conteúdo aprofundado, porém direto

Sem texto genérico ou vago

Cada seção deve agregar valor real`;

      const body = {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      };

      const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Robust extraction with fallbacks
      const content =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.output?.[0]?.content?.text || data?.output_text || '';

      if (!content) {
        return;
      }

      // Coloca o novo insight no topo para ficar imediatamente visível
      const existing = getInsights();
      const newInsights = [content, ...existing];

      // Tenta atualizar; se falhar, logamos e prosseguimos sem lançar
      try {
        const res = await updateInsightInCurrentParticle(newInsights);
        // Atualiza o cache local imediatamente para evitar sobrescrita por reads concorrentes
        if (res) setCurrentParticle(res);
      } catch (uErr) {
        // eslint-disable-next-line no-console
        console.error('Falha ao atualizar insight:', uErr);
      }

      // Garantir que UI mostre a primeira página com o novo insight
      setCurrentPage(1);
      setCurrentInsightIndex(0);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('generateInsight error', err);
      void setGeneratingInsight(false);
      setLoading(false);
      throw err;
    } finally {
      void setGeneratingInsight(false);
      setLoading(false);
    }
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
            {getInsights()
              .slice((currentPage - 1) * maxItems, (currentPage - 1) * maxItems + maxItems)
              .map((insight, i) => (
                <button
                  key={`${currentParticle?.id ?? 'p'}-insight-${i + (currentPage - 1) * maxItems}`}
                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl bg-white/2.5 p-8 font-semibold text-neutral-400 outline outline-white/5 transition-all hover:bg-white/5"
                  onClick={() => {
                    setCurrentInsightIndex(i + (currentPage - 1) * maxItems);
                  }}
                >
                  Insight {i + (currentPage - 1) * maxItems + 1}
                </button>
              ))}
          </div>
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
