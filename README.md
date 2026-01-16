# DevHero - Developer Tools

A consolidated suite of developer tools built with Next.js, Tailwind CSS, and TypeScript.
Originally migrated from standalone HTML/JS tools.

## Tools Included

- **Base64 HERO**: Encode/Decode Base64 with image preview.
- **JSON HERO**: Format, validate, and minify JSON with Monaco Editor.
- **HTML HERO**: Live HTML editor and previewer.
- **Lorem HERO**: Advanced Lorem Ipsum generator (Text/Words/Key-values).
- **Image HERO**: Mock image generator with size tuning and padding.
- **Mock HERO**: Thai/English synthetic data generator (names, addresses, IDs).

## Getting Started

### Prerequisites

- Node.js 18+ (Project uses Next.js 14)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel.

1. Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the project into Vercel.
3. Vercel will automatically detect Next.js and configure the build settings.
4. Deploy!

### Docker

A `Dockerfile` can be added for containerized deployment if needed, but Vercel is the easiest path.
