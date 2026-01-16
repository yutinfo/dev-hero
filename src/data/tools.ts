export interface Tool {
  id: string;
  name: string;
  href: string;
  description: string;
  accent: string;
  icon: string;
  tags: string[];
}

export const tools: Tool[] = [
  {
    id: 'image',
    name: 'IMAGE HERO',
    href: '/image',
    description: 'JPG/PNG mock image generator with custom width/height and target file weight.',
    accent: 'from-sky-400 via-cyan-300 to-emerald-300',
    icon: 'ImageSquare',
    tags: ['image', 'mock', 'padding']
  },
  {
    id: 'lorem',
    name: 'LOREM HERO',
    href: '/lorem',
    description: 'God-tier lorem ipsum generator with paragraphs, sentences, and word modes.',
    accent: 'from-amber-500 via-orange-400 to-yellow-300',
    icon: 'TextT',
    tags: ['text', 'mock', 'content']
  },
  {
    id: 'mock',
    name: 'MOCK HERO',
    href: '/mock',
    description: 'Thai synthetic dataset generator for names, phones, addresses, and coordinates.',
    accent: 'from-emerald-500 via-cyan-400 to-blue-400',
    icon: 'Database',
    tags: ['mock', 'address', 'geo']
  },
  {
    id: 'html',
    name: 'HTML HERO',
    href: '/html',
    description: 'Live HTML editor and previewer with copy, download, and open-in-tab.',
    accent: 'from-indigo-500 via-blue-400 to-sky-300',
    icon: 'Code',
    tags: ['html', 'preview', 'editor']
  },
  {
    id: 'base64',
    name: 'BASE64 HERO',
    href: '/base64',
    description: 'Bidirectional Base64 encoder/decoder with image preview support.',
    accent: 'from-purple-500 via-fuchsia-500 to-indigo-400',
    icon: 'TextAa',
    tags: ['encoding', 'utility']
  },
  {
    id: 'json',
    name: 'JSON HERO',
    href: '/json',
    description: 'Formatter, validator, and minifier powered by Monaco editor.',
    accent: 'from-sky-500 via-cyan-400 to-emerald-300',
    icon: 'BracketsCurly',
    tags: ['json', 'format', 'lint']
  }
];
