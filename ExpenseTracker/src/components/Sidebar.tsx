import { NavLink } from 'react-router-dom';
const links = [{ to: '/', label: 'Overview', icon: '◫' }, { to: '/transactions', label: 'Transactions', icon: '⇄' }, { to: '/add-expense', label: 'Add expense', icon: '+' }, { to: '/add-income', label: 'Add income', icon: '↗' }];
export default function Sidebar() {
  return <aside className="sidebar">
    <div className="brand">
      <span className="brand-mark">F</span>
      <span>FinTrack<small>PERSONAL FINANCE</small></span>
    </div>
    <div className="nav-label">WORKSPACE</div>
    <nav>{
      links.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><span className="nav-icon">{link.icon}</span>{link.label}</NavLink>)}</nav>
      <div className="sidebar-bottom"></div>
  </aside>;
}
