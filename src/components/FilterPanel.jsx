export function FilterPanel({ filters, onChange }) {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange(name, value);
  };

  return (
    <section className="card filters-grid">
      <label>
        搜索
        <input
          type="search"
          name="query"
          value={filters.query}
          onChange={handleChange}
          placeholder="输入名称 / 标签 / 备注"
        />
      </label>

      <label>
        状态
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="all">全部</option>
          <option value="active">进行中</option>
          <option value="expiring">即将到期</option>
          <option value="expired">已过期</option>
        </select>
      </label>

      <label>
        排序
        <select name="sort" value={filters.sort} onChange={handleChange}>
          <option value="nearest">到期日（近 → 远）</option>
          <option value="name">名称（A-Z）</option>
          <option value="price">价格（高 → 低）</option>
        </select>
      </label>
    </section>
  );
}
