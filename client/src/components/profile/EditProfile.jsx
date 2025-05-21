import Input from "../common/Input";
import Button from "../common/Button";

export default function EditProfile({ form, setForm, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <Input
        label="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        label="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          rows="4"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#4A6FFF]"
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
