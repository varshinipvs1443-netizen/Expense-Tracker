interface Props {
     label: string;
     value: string;
     trend: string;
     icon: string;
     tone: 'purple' | 'green' | 'orange' | 'blue';
    }
export default function StatCard(
    {
        label,
        value, 
        trend, 
        icon, 
        tone
    }: Props) {
        return <article className="stat-card">
            <div className="stat-top">
                <span>{label}</span>
                <span className={`stat-icon ${tone}`}>{icon}</span>
            </div>
            <strong className="stat-value">{value}</strong>
                <div className="stat-foot">
                    <span className="trend">↗ {trend}</span>
                    <span>vs. last month</span>
                </div>
        </article>;
    }
