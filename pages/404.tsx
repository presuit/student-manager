import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'

const CustomNotFound: NextPage = () => {
  const router = useRouter()
  useLayoutEffect(() => {
    router.replace('/')
  }, [])
  return <></>
}

export default CustomNotFound
