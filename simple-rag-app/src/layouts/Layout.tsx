import { PropsWithChildren } from 'react'
import PublicLayout from './Public/PublicLayout'

const Layout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>
}

export default Layout
