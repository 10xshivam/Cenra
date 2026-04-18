import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Web Content Sources | Cenra",
  description: "Crawl and sync your website pages to build a confident knowledge base for your Cenra AI agent.",
};

import { WebContentView } from '@/views/dashboard/knowledge-source/web-content-view'

const WebContent = () => {
  return (
    <WebContentView />
  )
}

export default WebContent
