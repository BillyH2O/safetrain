"use client"

import React, { PropsWithChildren } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ChatProvider } from '../context/ChatContext'

export default function Providers({children}: PropsWithChildren) {
  const queryClient = new QueryClient()
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <ChatProvider>
        {children}
        </ChatProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
