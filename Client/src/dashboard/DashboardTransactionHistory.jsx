export function DashboardTransactionHistory({ history }) {
  const style = {
    color: history.type === "income" ? "green" : "red",
  };

  return (
    <div
      className="!border-2 flex p-4 rounded-md"
      style={{
        border: "rgba(0,0,0,.2)",
      }}
    >
      <div className="mr-4">
        <img src={`/${history.category}.png`} className="w-6 h-6 object-fit" />
      </div>
      <div className="historyTitle mr-auto" style={style}>
        {history.title}
      </div>
      <div className="historyAmount" style={style}>
        {history.type === "income" ? `+ ` : `- `}
        {history.amount}
      </div>
    </div>
  );
}
