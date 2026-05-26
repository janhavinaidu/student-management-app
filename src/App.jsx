import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const BASE_URL = "http://localhost:8080/api/students";

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [marks, setMarks] = useState("");
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(BASE_URL);
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !course.trim() || !marks) return;

    const payload = {
      name: name.trim(),
      course: course.trim(),
      marks: Number(marks),
    };

    try {
      if (editId === null) {
        await axios.post(BASE_URL, payload);
        showToast("Student added successfully!");
      } else {
        await axios.put(`${BASE_URL}/${editId}`, payload);
        showToast("Student updated successfully!");
        setEditId(null);
      }
      setName("");
      setCourse("");
      setMarks("");
      await fetchStudents();
    } catch (error) {
      console.error(error);
      showToast("Operation failed. Is the backend running?", "error");
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setCourse(student.course);
    setMarks(student.marks);
    setEditId(student.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      showToast("Student deleted.");
      await fetchStudents();
    } catch (error) {
      console.error(error);
      showToast("Delete failed.", "error");
    }
  };

  const handleReset = () => {
    setName("");
    setCourse("");
    setMarks("");
    setEditId(null);
  };

  return (
    <div className="app-wrapper">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Student Management App</h1>
      </header>

      {/* Main Container */}
      <main className="main-container">
        {/* Form Card */}
        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-fields-row">
              <input
                id="input-name"
                className="form-input"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                id="input-course"
                className="form-input"
                type="text"
                placeholder="Enter course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              />
              <input
                id="input-marks"
                className="form-input"
                type="number"
                placeholder="Enter marks"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                min="0"
                max="100"
                required
              />
            </div>
            <div className="form-actions">
              <button id="btn-submit" type="submit" className="btn btn-primary">
                {editId === null ? "Add Student" : "Update Student"}
              </button>
              <button
                id="btn-reset"
                type="button"
                className="btn btn-reset"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="students-list">
          {students.length === 0 ? (
            <div className="empty-state">
              <p>No students yet. Add one above!</p>
            </div>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className={`student-card ${editId === student.id ? "student-card--editing" : ""}`}
              >
                <div className="student-info">
                  <h3 className="student-name">{student.name}</h3>
                  <p className="student-detail">
                    <span className="detail-label">Course:</span>{" "}
                    {student.course}
                  </p>
                  <p className="student-detail">
                    <span className="detail-label">Marks:</span>{" "}
                    {student.marks}
                  </p>
                </div>
                <div className="card-actions">
                  <button
                    id={`btn-edit-${student.id}`}
                    className="btn btn-edit"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    id={`btn-delete-${student.id}`}
                    className="btn btn-delete"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}