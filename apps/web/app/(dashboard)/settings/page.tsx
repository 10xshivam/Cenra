import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Cenra workspace configuration, profile information, and account preferences.",
};

import { SettingsView } from '@/views/dashboard/settings-view'
import React from 'react'

const SettingsPage = () => {
  return (
    <SettingsView />
  )
}



export default SettingsPage
