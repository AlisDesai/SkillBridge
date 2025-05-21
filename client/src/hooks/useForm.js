import { useState } from "react";

export default function useForm(initialValues = {}) {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialValues);
  };

  return { form, handleChange, resetForm, setForm };
}
