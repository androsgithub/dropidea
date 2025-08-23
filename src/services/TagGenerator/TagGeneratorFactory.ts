import type ITagGenerator from './ITagGenerator';
import type { ITagGeneratorOptions } from './ITagGenerator';
import { TagGeneratorGemini } from './TagGeneratorGemini';
import { TagGeneratorLocal } from './TagGeneratorLocal';

export class TagGeneratorFactory {
  static create(options: ITagGeneratorOptions): ITagGenerator {
    const hasInternet = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (hasInternet && options.apiKey) {
      return new TagGeneratorGemini(options);
    } else {
      return new TagGeneratorLocal(options);
    }
  }
}
