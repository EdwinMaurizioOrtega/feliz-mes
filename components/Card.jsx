export default function Card({ children, className = '' }) {
  return (
    <div className={`card ${className}`.trim()}>
      <div className="card-corner tl" />
      <div className="card-corner tr" />
      <div className="card-corner bl" />
      <div className="card-corner br" />
      {children}
    </div>
  );
}
