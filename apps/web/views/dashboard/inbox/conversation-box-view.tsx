import React from 'react'

export const ConversationBoxView = ({conversationId}: {conversationId: string}) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>ConversationBoxView <br />{conversationId}</div>
  )
}
