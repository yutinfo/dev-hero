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
  },
  {
    id: 'jwt',
    name: 'JWT HERO',
    href: '/jwt',
    description: 'Securely decode JWT tokens to inspect Header, Payload, and Signature.',
    accent: 'from-purple-500 via-indigo-500 to-blue-500',
    icon: 'Key',
    tags: ['jwt', 'security', 'token', 'decode']
  },
  {
    id: 'timestamp',
    name: 'TIMESTAMP HERO',
    href: '/timestamp',
    description: 'Convert Unix Timestamps to Human Dates and back with multi-timezone support.',
    accent: 'from-blue-500 via-indigo-500 to-violet-500',
    icon: 'Clock',
    tags: ['dev', 'timestamp', 'conversion']
  },
  {
    id: 'hash',
    name: 'HASH HERO',
    href: '/hash',
    description: 'Secure client-side hashing (MD5, SHA, HMAC) with zero server latency.',
    accent: 'from-rose-500 via-pink-500 to-fuchsia-400',
    icon: 'Fingerprint',
    tags: ['security', 'crypto', 'md5', 'sha']
  }
];
