import { motion } from 'framer-motion';

export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <motion.p
      className="error-message"
      role="alert"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {message}
    </motion.p>
  );
}
