export default function PageContainer({ eyebrow, title, children, actions }) {
  return (
    <main className="page">
      <section className="page-header">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </section>
      {children}
    </main>
  );
}
