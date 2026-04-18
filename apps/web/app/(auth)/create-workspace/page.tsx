import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Workspace | Cenra",
  description: "Set up your Cenra workspace to start automating and managing your customer interactions effectively.",
};

import { CreateWorkspaceView } from '@/views/auth/create-workspace-view'

const CreateWorkspace = () => {
  return (
    <CreateWorkspaceView />
  )
}

export default CreateWorkspace
