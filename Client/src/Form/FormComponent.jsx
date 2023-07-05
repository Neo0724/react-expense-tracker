import { useState, useEffect } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useGlobalContext } from "../Context/GlobalContextProvider";
import { useCookies } from "react-cookie"

export default function FormComponent({ type }) {
    const { fetchIncome, fetchExpenses, BASE_URL, setClose } = useGlobalContext()
    const [ data, setData ] = useState({
        title: "",
        amount: "",
        date: "",
        category: "",
        description: "",
        userOwner: ""
    })

    const [ cookies, setCookies ] = useCookies(["access_token"])
    console.log(data)
    const addUserOwner = async () => {
        return new Promise((resolve, reject) => {
            const userOwner = localStorage.getItem("User ID")
            let newData = { ...data, userOwner}
            setData(newData)
            resolve(newData)
        })
    }

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
                    let category = e.target.value
                    category === "foodandbeverage" ? category = "Food and Beverage" : category

                    if (e.target.value === "other") { 
                        return {...prev, category: e.target.value, title: ""}
                    } else {
                        return {...prev, category: e.target.value, title: category.charAt(0).toUpperCase() + category.slice(1)}
                    }
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!cookies.access_token) {
                setClose(prev => !prev)
                return 
            }
            const updatedData = await addUserOwner()
            type === "income" ? await axios.post(`${BASE_URL}/income/add-income`, {...updatedData}, {headers: { authorization: cookies.access_token}}) : await axios.post(`${BASE_URL}/expense/add-expense`, {...updatedData}, {headers: { authorization: cookies.access_token}})
            type === "income" ? fetchIncome() : fetchExpenses() 
        } catch (err) {
            console.log(err)
        }


    }

    const IncomeSelect = () => {
        return (
            <select required value={data.category} onChange={(e) => handleChange(e, "category")} placeholder="Select a category">
                <option value="" disabled>Select an option</option>
                <option value="salary" >Salary</option>
                <option value="freelancing" >Freelancing</option>
                <option value="investment" >Investment</option>
                <option value="scholarship" >Scholarship</option>
                <option value="bank" >Bank Transfer</option>
                <option value="other" >Other</option>
            </select>
            )
    }

    const ExpensesSelect = () => {
        return (
            <select required value={data.category} onChange={(e) => handleChange(e, "category")} placeholder="Select a category">
                <option value="" disabled>Select an option</option>
                <option value="accomodation" >Accomodation</option>
                <option value="foodandbeverage" >Food And Beverage</option>
                <option value="medical" >Medical</option>
                <option value="scholarship" >Scholarship</option>
                <option value="transport" >Trasnsport Fee</option>
                <option value="stationary" >Stationary</option>
                <option value="other" >Other</option>
            </select>
        )
    }

  return (
    <form action="POST" className="formContainer" onSubmit={(e) => handleSubmit(e)}>
        <input type="text" className="amountInput" placeholder="Enter the amount..." required value={data.amount} onChange={(e) => handleChange(e, "amount")}/>
        <ReactDatePicker 
            className="dateInput" 
            dateFormat="dd/MM/yyyy"
            selected={data.date} 
            onChange={(date) => handleDateChange(date)} placeholderText="Select a date..." 
            startDate={data.date}
        />
        { type === "income" ? <IncomeSelect /> : <ExpensesSelect />}
        { data.category === "other" ? <input type="text" className="titleInput" placeholder="Enter the title..." required value={data.title} onChange={(e) => handleChange(e, "title")}/> : null }
        <textarea cols="30" rows="6" maxLength="70" placeholder="Enter description" className="descriptionInput" value={data.description} onChange={(e) => handleChange(e, "description")}></textarea>
        <button className="submitBtn" type="submit">submit</button>
    </form>
  )
}
