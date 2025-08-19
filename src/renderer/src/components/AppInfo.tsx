/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useState } from 'react'

function AppInfo() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    async function fetchVersion() {
      const v = await (window.electronAPI as {
        getAppVersion: () => Promise<string>
      }).getAppVersion()
      setVersion(v)
    }
    fetchVersion()
  }, [])

  return <div className="text-[12px]  text-gray-500 text-center">@vsrsio FURG-HU - v{version}</div>
}

export default AppInfo
