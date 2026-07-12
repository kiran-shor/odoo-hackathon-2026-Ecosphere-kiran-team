import { motion, useReducedMotion } from 'framer-motion';

export default function PageContainer({ eyebrow, title, children, actions }) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="page">
      <motion.section
        className="page-header impact-contours"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="page-title-block">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </motion.section>
      {children}
    </main>
  );
}
