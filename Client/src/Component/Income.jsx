import Form from "../Form/FormComponent";
import { useGlobalContext } from "../Context/useGlobalContext";
import { IncomeContainer } from "./IncomeAndExpenseContainer";

export default function Income() {
  const { income, setIncome, getTotalIncome } = useGlobalContext();

  return (
    <div className="incomeUpperContainer">
      <div className="incomeTitle">Income</div>
      <div className="totalIncome">Total Income: $ {getTotalIncome()}</div>
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
