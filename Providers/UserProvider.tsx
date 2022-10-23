/* eslint-disable react/prop-types */
import { onAuthStateChanged } from 'firebase/auth'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { fbAuth } from '../utils/firebase'

interface IUSerContext_User {
  uid: string
  email: string | null
  name: string | null
}

interface IUserContext {
  user: IUSerContext_User | null
  isLoading: boolean
}

export const UserContext = createContext<IUserContext>({ isLoading: true, user: null })

const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [ctx, setCtx] = useState<IUserContext>({ isLoading: true, user: null })
  useEffect(() => {
    onAuthStateChanged(fbAuth, user => {
      setCtx(prev => ({ ...prev, isLoading: true }))
      if (user) {
        setCtx({ isLoading: false, user: { uid: user.uid, email: user.email, name: user.displayName } })
      } else {
        setCtx({ isLoading: false, user: null })
      }
    })
  }, [])
  return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>
}

export default UserProvider
