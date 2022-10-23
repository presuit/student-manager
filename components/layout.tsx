/* eslint-disable react/prop-types */
import { PropsWithChildren } from 'react'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="min-h-screen w-full">{children}</div>
}

export default Layout
