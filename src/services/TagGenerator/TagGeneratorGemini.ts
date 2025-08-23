import type ITagGenerator from './ITagGenerator';
import type { ITagGeneratorOptions } from './ITagGenerator';

export class TagGeneratorGemini implements ITagGenerator {
  options!: ITagGeneratorOptions;
  constructor(options: ITagGeneratorOptions) {
    this.options = options;
  }

  async generateTags(content: string): Promise<string[]> {
    if (content.length < 8) throw new Error('Content invalid text lenght');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: `Leia o texto abaixo e gere de 1 a 3 **tags conceituais amplas** que indiquem **categorias gerais** do conteúdo.  
Regras:  
1. Use **apenas palavras curtas ou frases de 1-2 palavras**.  
2. Evite detalhes específicos do texto, exemplos ou termos técnicos.  
3. Pense em categorias amplas como "Jogos", "Tecnologia", "Arte", "Esportes", "Educação", "Natureza", etc.  
4. Responda **somente com as tags**, separadas por vírgula, sem explicações ou pontuação extra.  

Texto: "${content}"`
            }
          ]
        }
      ]
    };

    const response = await fetch(`${url}?key=${this.options.apiKey}`, {
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
    const text = data['candidates'][0]['content']['parts'][0]['text'];

    console.log(data);
    return text
      .trim()
      .split(',')
      .map((tag: string) => tag.trim());
  }
}
