import React from 'react'
import { useState } from 'react'
import { useGlobalContext } from './Context/GlobalContextProvider'

export default function PopUp() {
    const { setClose, close } = useGlobalContext()

    const style = {
        display: close ? "none" : "flex"
    }

    const handleClick = () => {
        setClose(!close)
    }


    return (
        <div className="popupContainer" style={style}>
            <div className="popupContent">
                <div className="popupText">Please log in before using it</div>
                <button className="closePopup" onClick={handleClick}>ok</button>
            </div>
        </div>
    )
}
