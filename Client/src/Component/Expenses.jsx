import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useGlobalContext } from '../Context/GlobalContextProvider'

export default function Expenses() {

    const { expenses } = useGlobalContext()
    console.log(expenses)

  return (
    <div>Expenses:</div>
  )
}
