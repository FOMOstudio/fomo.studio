# Fomo Studio Landing Page

A modern, interactive landing page for Fomo Studio featuring an AI chatbot that simulates conversation with the agency founder. This project showcases a sleek design with animated elements and a functional AI assistant that can provide information about services, pricing, and even schedule meetings.

## Features

- **Interactive AI Chat**: A GPT-4o powered chatbot that represents the agency's founder
- **Animated Intro**: Stylish text scramble animations for a memorable first impression
- **Meeting Scheduling**: Integration with calendar tools to book meetings directly through the chat
- **Pricing Information**: Dynamic display of service packages and pricing
- **Responsive Design**: Fully responsive layout that works on all devices
- **Modern UI**: Built with Next.js, React, and Tailwind CSS

## Chatbot Capabilities

The AI assistant can:

- Provide information about Fomo Studio's services and team
- Display pricing packages when users inquire about projects
- Schedule meetings by showing available calendar slots through Cal.com API integration
- Answer questions about the agency's expertise and past projects
- Generate link buttons for external resources
- Maintain a conversational, branded tone throughout interactions

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI GPT-4o via Vercel AI SDK
- **Calendar Integration**: Cal.com API
- **Styling**: Tailwind CSS, Shadcn UI components
- **Rate Limiting**: Upstash Redis
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Copy `.env.example` to `.env.local` and add your API keys
4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Required environment variables:

- `OPENAI_API_KEY` - Your OpenAI API key
- `UPSTASH_REDIS_REST_URL` - Upstash Redis URL for rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis token
- `CAL_API_KEY` - Cal.com API key for calendar integration
- `CAL_USERNAME` - Cal.com username for accessing calendar
- Other service-specific variables as needed for calendar integration

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
