import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Importer | Cenra",
  description: "Upload and sync documents, FAQs, and files to train your Cenra AI support agent.",
};

import { DataImporterView } from '@/views/dashboard/knowledge-source/data-importer-view'

const DataImporter = () => {
  return (
    <DataImporterView />
  )
}

export default DataImporter
