import { useState } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";

export default function Form() {
    const [ data, setData ] = useState({
        title: "",
        amount: "",
        type: "income",
        date: "",
        category: "",
        description: ""
    })

    const handleChange = (e, type) => {
        switch (type) {
            case "title":
                setData(prev => {
                    return {...prev, title: e.target.value}
                })
                break
            
            case "amount":
                setData(prev => {
                    return {...prev, amount: e.target.value}
                })
                break
            
            case "category":
                setData(prev => {
                    return {...prev, category: e.target.value}
                })
                return
            
            case "description":
                setData(prev => {
                    return {...prev, description: e.target.value}
                })
                return

            default:
                return

        }
    }

    const handleDateChange = (date) => {
        setData(prev => { 
            return {...prev, date: date}
        })
    }

  return (
    <form action="POST" className="formContainer">
        <input type="text" className="titleInput" placeholder="Enter the title..." required value={data.title} onChange={(e) => handleChange(e, "title")}/>
        <input type="text" className="amountInput" placeholder="Enter the amount..." required value={data.amount} onChange={(e) => handleChange(e, "amount")}/>
        <ReactDatePicker dateFormat="dd/MM/yyyy" selected={data.date} onChange={(date) => handleDateChange(date)} placeholderText="Select a date..."/>
        <select required value={data.category} onChange={(e) => handleChange(e, "category")}>
            <option value="" disabled>Select an option</option>
            <option value="salary" >Salary</option>
            <option value="freelancing" >Freelancing</option>
            <option value="investment" >Investment</option>
            <option value="scholarship" >Scholarship</option>
            <option value="bank" >Bank Transfer</option>
            <option value="other" >Other</option>
        </select>
        <textarea cols="30" rows="6" className="descriptionInput" value={data.description} onChange={(e) => handleChange(e, "description")}></textarea>
    </form>
  )
}
