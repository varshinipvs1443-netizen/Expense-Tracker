import type { Transaction } from '../types';
const money = (n: number) => `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export default function TransactionTable(
  { 
    transactions, onDelete
  }: 
  { 
    transactions: Transaction[];
    onDelete?: (id: number) => void 
  }) 
  {
    if (!transactions.length) return <div className="empty-state">No transactions match. Try changing your search or add a transaction.</div>;
    return <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>TRANSACTION</th>
            <th>CATEGORY</th>
            <th>DATE</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            {
              onDelete && <th></th>
            }
          </tr>
        </thead>
        <tbody>{
          transactions.map(t =>
          <tr key={t.id}>
            <td>
              <div className="transaction-title">
                <span className={
                  `merchant-icon ${t.type === 'Income' ? 'income' : ''}`}>{t.type === 'Income' ? '↗' : t.category.slice(0, 1)}
                </span>
                <div>
                  <strong>{t.title}</strong>
                  <small>{t.note || (t.type === 'Income' ? 'Money received' : 'Card payment')}</small>
                </div>
              </div>
            </td>
            <td>
              <span className="category-pill">{t.category}</span>
            </td>
            <td>
              {new Date(`${t.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td className={t.type === 'Income' ? 'amount income-text' : 'amount'}>{t.type === 'Income' ? '+' : '−'}{money(t.amount)}
            </td>
            <td>
              <span className="status">
                <i /> Completed
              </span>
            </td>
            {onDelete && <td>
              <button className="icon-button" title="Delete transaction" onClick={() => onDelete(t.id)}>×</button>
            </td>
            }
          </tr>)}
        </tbody>
      </table>
    </div>;
}
