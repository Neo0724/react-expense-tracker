import Form from "../Form/FormComponent";
import { useGlobalContext } from "../Context/useGlobalContext";
import { IncomeContainer } from "./IncomeAndExpenseContainer";
import { useEffect, useState } from "react";

export default function Income() {
    const {
        getTotalIncomeByMonthAndYear,
        fetchIncome
    } = useGlobalContext();


    const [ income, setIncome ] = useState([])

    const [ totalIncome, setTotalIncome ] = useState(0);

    useEffect(() => {
        const updateIncome = async () => {
            const fetchedIncome = await fetchIncome("all", "all");

            setIncome(fetchedIncome);
            setTotalIncome(getTotalIncomeByMonthAndYear(fetchedIncome));
        };

        updateIncome();
    }, [])

  return (
    <div className="incomeUpperContainer">
      <div className="incomeTitle">Income</div>
      <div className="totalIncome">Total Income: $ {totalIncome}</div>
      <div className="incomeLowerContainer">
        <Form type="income" />
        <div className="incomeTransactionContainer">
          <div className="listOfIncome">List of Income: </div>
          {!income.length ? <div className="empty">Empty ...</div> : null}
          {income.map((income) => {
            const randomID = crypto.randomUUID();
            return (
              <IncomeContainer
                income={income}
                setIncome={setIncome}
                key={randomID}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
