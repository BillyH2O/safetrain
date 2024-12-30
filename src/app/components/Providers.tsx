"use client"

import React, { PropsWithChildren } from 'react'
import { NextUIProvider } from '@nextui-org/react'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

export default function Providers({children}: PropsWithChildren) {
  const queryClient = new QueryClient()
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </NextUIProvider>
  );
}
