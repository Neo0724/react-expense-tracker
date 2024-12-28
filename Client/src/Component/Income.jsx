import Form from "../Form/FormComponent";
import { useGlobalContext } from "../Context/useGlobalContext";
import { IncomeContainer } from "./IncomeAndExpenseContainer";
import { useEffect, useState } from "react";

export default function Income() {
  const { getTotalIncomeByMonthAndYear, fetchIncome } = useGlobalContext();

  const [income, setIncome] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const updateIncome = async () => {
      try {
        const fetchedIncome = await fetchIncome("all", "all", "all");

        setIncome(fetchedIncome);
        setTotalIncome(getTotalIncomeByMonthAndYear(fetchedIncome));
      } catch (err) {
        console.log(err);
      }
    };

    updateIncome();
  }, []);

  return (
    <div className="incomeUpperContainer">
      <div className="incomeTitle">Income</div>
      <div className="totalIncome">
        Total Income: $ {parseFloat(totalIncome).toFixed(2)}
      </div>
      <div className="incomeLowerContainer">
        <Form
          type="income"
          setIncome={setIncome}
          setTotalIncome={setTotalIncome}
        />
        <div className="incomeTransactionContainer">
          <div className="listOfIncome">List of Income: </div>
          {!income || income.length === 0 ? (
            <div className="empty">Empty ...</div>
          ) : (
            income.map((item) => {
              const randomID = crypto.randomUUID();
              return (
                <IncomeContainer
                  income={item}
                  setIncome={setIncome}
                  setTotalIncome={setTotalIncome}
                  key={randomID}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
