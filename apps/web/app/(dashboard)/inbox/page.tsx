import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox | Cenra",
  description: "Manage all customer conversations and escalations from your Cenra shared inbox dashboard.",
};

import { InboxView } from '@/views/dashboard/inbox/inbox-view'

const Inbox = () => {
  return (
    <InboxView />
  )
}

export default Inbox
