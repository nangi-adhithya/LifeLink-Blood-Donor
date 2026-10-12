export default function DonorList({ donors, onEdit, onDelete }) {
  if (donors.length === 0) {
    return <p className="empty">No donors found. Register a donor to begin.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Blood group</th>
            <th>Phone</th>
            <th>City</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {donors.map((donor) => (
            <tr key={donor.id}>
              <td>{donor.name}</td>
              <td>{donor.age}</td>
              <td>
                <span className="blood-badge">{donor.bloodGroup}</span>
              </td>
              <td>{donor.phone}</td>
              <td>{donor.city}</td>
              <td>
                <span className={donor.available ? "available" : "unavailable"}>
                  {donor.available ? "Available" : "Unavailable"}
                </span>
              </td>
              <td className="actions">
                <button className="edit-button" onClick={() => onEdit(donor)}>
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(donor.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}