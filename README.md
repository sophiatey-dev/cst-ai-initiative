# CST AI Initiative × Kaku

Bilingual English–Chinese website for the CST AI Initiative, CST AI Forum AIR,
practical AI workshops, Kaku membership, community activities, AI Pulse and
enterprise services.

## Website sections

- Home
- CST AI Forum AIR
- Free AI Workshops and Kaku Go Learning Classroom
- Kaku Membership
- Community
- Calendar
- AI Pulse
- Speakers
- Enterprise
- About

English pages are available from `/`. Chinese pages use the `/zh` prefix.

## Content and assets

Website-ready public files are stored in `public/assets/`:

```text
public/assets/
├── about/                 Jane Goodall / Ka-Ku story visuals
├── brand/                 CST and Kaku brand assets
├── events/
│   ├── community/         Community and workshop photography
│   └── forum-air/         Forum AIR photography
├── learning/
│   └── prompt-thinking/   AI Prompt Thinking visuals
├── partners/              Partner logos
├── people/                Initiator, trainer and speaker portraits
├── social/                Social sharing and Open Graph artwork
├── testimonials/          Testimonial portraits
└── video/                 Hero and event videos
```

Source information that is not directly displayed as a public asset belongs in
`content/`. See [Content checklist](content/CONTENT-CHECKLIST.md).

## Adding new material

1. Put the file in the matching folder under `public/assets/`.
2. Use lowercase filenames with hyphens, for example
   `sophia-tey-forum-air-2026.jpg`.
3. Keep original high-resolution material outside the website repository.
4. Upload web-ready JPG/WebP files below 2 MB when possible.
5. Add speaker bios, event details, programme copy and permissions in `content/`.

Full guidance is in [Asset guide](public/assets/README.md).

## Local preview

Requirements: Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run build
```

## Contact

- Email: anna@cst.training
- WhatsApp: +60 18-660 6731

