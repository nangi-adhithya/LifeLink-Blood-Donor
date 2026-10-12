
import { useCallback, useEffect, useState } from "react";
import DonorList from "./components/DonorList";
import {
  getDonors,
  searchDonors,
  createDonor,
  updateDonor,
  deleteDonor,
} from "./services/donorService";
import "./App.css";

import "./App.css";

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  city: "",
  available: true,
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function App() {
  const [donors, setDonors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    bloodGroup: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDonors = useCallback(async (activeFilters = {}) => {
    setLoading(true);
    setError("");

    try {
      const data = await searchDonors(activeFilters);
      setDonors(data);
    } catch (err) {
      setError(err.message || "Unable to load donors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDonors();
  }, [loadDonors]);

  function changeField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const donor = {
      ...form,
      age: Number(form.age),
    };

    try {
      if (editingId !== null) {
        await updateDonor(editingId, donor);
        setNotice("Donor updated successfully.");
      } else {
        await createDonor(donor);
        setNotice("Donor registered successfully.");
      }

      resetForm();
      await loadDonors(filters);
    } catch (err) {
      setError(err.message || "Could not save donor.");
    }
  }

  function handleEdit(donor) {
    setEditingId(donor.id);
    setForm({
      name: donor.name,
      age: String(donor.age),
      gender: donor.gender,
      bloodGroup: donor.bloodGroup,
      phone: donor.phone,
      city: donor.city,
      available: donor.available,
    });

    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this donor?")) {
      return;
    }

    setError("");
    setNotice("");

    try {
      await deleteDonor(id);
      setNotice("Donor deleted successfully.");
      await loadDonors(filters);
    } catch (err) {
      setError(err.message || "Could not delete donor.");
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    setNotice("");
    await loadDonors(filters);
  }

  async function clearSearch() {
    const emptyFilters = { name: "", city: "", bloodGroup: "" };
    setFilters(emptyFilters);
    setNotice("");
    await loadDonors(emptyFilters);
  }

  const availableCount = donors.filter((donor) => donor.available).length;

  return (
    <main className="app">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">DONATE BLOOD · SAVE LIVES</p>
          <h1>LifeLink</h1>
          <p className="hero-description">
            Connecting blood donors with people who need them.
          </p>
        </div>
        <div className="hero-symbol" aria-hidden="true">+</div>
      </header>

      <section className="stats">
        <article className="stat-card">
          <span>Total donors</span>
          <strong>{donors.length}</strong>
        </article>
        <article className="stat-card">
          <span>Available in results</span>
          <strong>{availableCount}</strong>
        </article>
        <article className="stat-card">
          <span>Blood groups</span>
          <strong>{bloodGroups.length}</strong>
        </article>
      </section>

      {error && <p className="message error">{error}</p>}
      {notice && <p className="message success">{notice}</p>}

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DONOR DETAILS</p>
            <h2>{editingId !== null ? "Update donor" : "Register a donor"}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="donor-form">
          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={changeField}
              placeholder="Enter full name"
              required
              maxLength={100}
            />
          </label>

          <label>
            Age
            <input
              name="age"
              type="number"
              min="18"
              max="100"
              value={form.age}
              onChange={changeField}
              placeholder="18–100"
              required
            />
          </label>

          <label>
            Gender
            <select
              name="gender"
              value={form.gender}
              onChange={changeField}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Blood group
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={changeField}
              required
            >
              <option value="">Select blood group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </label>

          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={form.phone}
              onChange={changeField}
              placeholder="10-digit phone"
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={changeField}
              placeholder="Enter city"
              required
              maxLength={100}
            />
          </label>

          <label className="availability-field">
            Donor availability
            <select
              value={String(form.available)}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  available: event.target.value === "true",
                }))
              }
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </label>

          <div className="form-actions">
            <button className="primary-button" type="submit">
              {editingId !== null ? "Save changes" : "Register donor"}
            </button>

            {editingId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DONOR DIRECTORY</p>
            <h2>Find blood donors</h2>
          </div>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <label>
            Name
            <input
              value={filters.name}
              onChange={(event) =>
                setFilters((f) => ({ ...f, name: event.target.value }))
              }
              placeholder="Search by name"
            />
          </label>

          <label>
            City
            <input
              value={filters.city}
              onChange={(event) =>
                setFilters((f) => ({ ...f, city: event.target.value }))
              }
              placeholder="Exact city"
            />
          </label>

          <label>
            Blood group
            <select
              value={filters.bloodGroup}
              onChange={(event) =>
                setFilters((f) => ({ ...f, bloodGroup: event.target.value }))
              }
            >
              <option value="">All blood groups</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </label>

          <div className="search-actions">
            <button className="primary-button" type="submit">Search</button>
            <button
              className="secondary-button"
              type="button"
              onClick={clearSearch}
            >
              Clear
            </button>
          </div>
        </form>

        {loading ? (
          <p className="empty">Loading donors...</p>
        ) : (
          <DonorList
            donors={donors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      <footer>
        <p>LifeLink Blood Donor Management System</p>
        <p>Contact donors only with appropriate consent and respect for privacy.</p>
      </footer>
    </main>
  );
}