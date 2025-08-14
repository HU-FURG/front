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

  return <div className="text-sm text-gray-500">@vsrsio lamsa-furm - v{version}</div>
}

export default AppInfo
