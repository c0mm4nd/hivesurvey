'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export interface User {
  name: string,
  active: string, // active key
  signature: string,
  network: "steemit" | "hive"
}

export const UserContext = createContext<{
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
}>({
  user: null,
  setUser: null
});

export function Providers({
  children
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState(null as User | null)

  return (
    <CacheProvider>
      <ChakraProvider>
        <UserContext.Provider value={{
          user: user, setUser: setUser
        }}>
          {children}
        </UserContext.Provider>
      </ChakraProvider>
    </CacheProvider>
  )
}