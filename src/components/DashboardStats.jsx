export function DashboardStats({ stats }) {
  return (
    <section className="dashboard">
      <div className="card stat">
        <p>总订阅</p>
        <h2>{stats.total}</h2>
      </div>
      <div className="card stat">
        <p>即将到期 (14 天内)</p>
        <h2>{stats.expiringSoon}</h2>
      </div>
      <div className="card stat">
        <p>已过期</p>
        <h2>{stats.expired}</h2>
      </div>
      <div className="card stat">
        <p>当年费用</p>
        <h2>{stats.annualCostDisplay}</h2>
      </div>
    </section>
  );
}
