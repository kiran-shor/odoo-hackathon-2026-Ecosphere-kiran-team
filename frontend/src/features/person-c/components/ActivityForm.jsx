import { useState } from 'react';
import ErrorMessage from '../../../components/ErrorMessage';

const initialForm = {
  title: '',
  category: '',
  description: '',
  departmentId: 1,
  pointsReward: 25,
};

export default function ActivityForm({ onSubmit, submitting, error }) {
  const [form, setForm] = useState(initialForm);

  function updateField(event) {
    const { name, value } = event.target;
    const nextValue =
      name === 'departmentId' || name === 'pointsReward' ? Number(value) : value;

    setForm((current) => ({
      ...current,
      [name]: nextValue,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const submitted = await onSubmit({
      title: form.title,
      category: form.category,
      description: form.description,
      departmentId: Number(form.departmentId),
      pointsReward: Number(form.pointsReward),
    });

    if (submitted !== false) {
      setForm(initialForm);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <h2>Create Activity</h2>
        <p>Add a CSR activity employees can participate in.</p>
      </div>

      <ErrorMessage message={error} />

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="Community Clean-up"
          required
        />
      </label>

      <label>
        Category
        <input
          name="category"
          value={form.category}
          onChange={updateField}
          placeholder="Community"
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Clean a local public space"
          required
          rows="3"
        />
      </label>

      <label>
        Department ID
        <input
          min="1"
          name="departmentId"
          type="number"
          value={form.departmentId}
          onChange={updateField}
          required
        />
      </label>

      <label>
        Points Reward
        <input
          min="0"
          name="pointsReward"
          type="number"
          value={form.pointsReward}
          onChange={updateField}
          required
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create activity'}
      </button>
    </form>
  );
}
