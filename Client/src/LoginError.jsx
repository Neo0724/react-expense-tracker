import React, { useState } from 'react'
import { useGlobalContext } from './Context/GlobalContextProvider'

export default function LoginError() {

    const { loginErr, setLoginErr } = useGlobalContext()

    const timeOut = () => {
        setTimeout(() => {
            setLoginErr({ text: "", error: false})
        }, 3000)
    }

    if (loginErr.error) {
        timeOut()
        clearTimeout(timeOut)
    }


  return (
    <div className="loginErrorContainer" id={ loginErr.error ? "loginErrTrue" : null}>
        <div className="errorText">{loginErr.text}</div>
    </div>
  )
}
