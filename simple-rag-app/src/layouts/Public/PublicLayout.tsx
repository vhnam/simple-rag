import { PropsWithChildren } from 'react'
import Header from './Header'
import { Toaster } from 'sonner'

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Toaster />
    </>
  )
}

export default PublicLayout
