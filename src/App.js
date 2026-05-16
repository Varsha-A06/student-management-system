import React, { useState, useEffect } from "react";
import "./App.css";

import {
  FaUserGraduate,
  FaUsers,
  FaBook,
  FaCog,
  FaInfoCircle,
  FaUser,
  FaShieldAlt,
  FaPalette,
  FaSignOutAlt
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function App() {

  const [page, setPage] = useState("dashboard");

  const [students, setStudents] = useState([
    { id: "101", name: "Arun Kumar", department: "CSE", year: "3rd Year", arrears: 0, fees: "Paid", status: "Excellent", cgpa: "8.9" },
    { id: "102", name: "Priya Sharma", department: "ECE", year: "Final Year", arrears: 1, fees: "Pending", status: "Average", cgpa: "7.5" },
    { id: "103", name: "Rahul Raj", department: "IT", year: "2nd Year", arrears: 0, fees: "Paid", status: "Excellent", cgpa: "9.1" },
    { id: "104", name: "Meena Lakshmi", department: "AIML", year: "3rd Year", arrears: 0, fees: "Paid", status: "Excellent", cgpa: "8.7" }
  ]);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    department: "",
    year: "",
    cgpa: "",
    fees: ""
  });

  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const processed = {
      ...newStudent,
      arrears: newStudent.fees === "Paid" ? 0 : 1,
      status: Number(newStudent.cgpa) >= 8 ? "Excellent" : "Average"
    };

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = processed;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, processed]);
    }

    setNewStudent({
      id: "",
      name: "",
      department: "",
      year: "",
      cgpa: "",
      fees: ""
    });
  };

  const handleEdit = (i) => {
    setNewStudent(students[i]);
    setEditIndex(i);
    setPage("dashboard");
  };

  const handleDelete = (i) => {
    if (window.confirm("Delete this student?")) {
      setStudents(students.filter((_, index) => index !== i));
    }
  };

  const departments = ["CSE","ECE","EEE","IT","AIML","CIVIL","MECH"];

  const departmentData = departments.map((d) => ({
    name: d,
    students: students.filter((s) => s.department === d).length
  }));

  const feeData = [
    { name: "Paid", value: students.filter(s => s.fees === "Paid").length },
    { name: "Pending", value: students.filter(s => s.fees === "Pending").length }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  const filteredStudents = students.filter((s) =>
    (departmentFilter === "All" || s.department === departmentFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search))
  );

  // ================= DASHBOARD =================
  const Dashboard = () => (
    <>
      <h1>Smart Student Management Portal</h1>

      <div className="cards">
        <div className="card"><h2>{students.length}</h2><p>Total Students</p></div>
        <div className="card"><h2>{students.filter(s=>s.fees==="Pending").length}</h2><p>Fees Pending</p></div>
        <div className="card"><h2>{students.filter(s=>s.arrears>0).length}</h2><p>Arrears</p></div>
      </div>

      <div className="controls">
        <input placeholder="Search..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        <select onChange={(e)=>setDepartmentFilter(e.target.value)}>
          <option>All</option>
          {departments.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>

      <form className="student-form" onSubmit={handleSubmit}>
        <input name="id" placeholder="ID" value={newStudent.id} onChange={handleChange}/>
        <input name="name" placeholder="Name" value={newStudent.name} onChange={handleChange}/>
        <input name="department" placeholder="Dept" value={newStudent.department} onChange={handleChange}/>
        <input name="year" placeholder="Year" value={newStudent.year} onChange={handleChange}/>
        <input name="cgpa" placeholder="CGPA" value={newStudent.cgpa} onChange={handleChange}/>
        <select name="fees" value={newStudent.fees} onChange={handleChange}>
          <option>Paid</option>
          <option>Pending</option>
        </select>

        <button>{editIndex !== null ? "Update" : "Add"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Dept</th><th>Year</th><th>CGPA</th><th>Fees</th><th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredStudents.map((s,i)=>(
            <tr key={i}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.department}</td>
              <td>{s.year}</td>
              <td>{s.cgpa}</td>
              <td>{s.fees}</td>
              <td>
                <button onClick={()=>handleEdit(i)}>Edit</button>
                <button onClick={()=>handleDelete(i)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Department Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="students" fill="#2563eb"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Fees Analytics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={feeData} dataKey="value" outerRadius={100}>
                {feeData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  // ================= STUDENTS PAGE =================
  const StudentsPage = () => (
    <div>
      <h2>Students Page</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Dept</th></tr>
        </thead>
        <tbody>
          {students.map(s=>(
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ================= DEPARTMENTS =================
  const DepartmentsPage = () => (
    <div>
      <h2>Departments</h2>
      <table>
        <thead>
          <tr><th>Dept</th><th>Students</th></tr>
        </thead>
        <tbody>
          {departmentData.map(d=>(
            <tr key={d.name}>
              <td>{d.name}</td>
              <td>{d.students}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
// ================= SETTINGS (TOUCHABLE FIX) =================
const SettingsPage = () => (
  <div>
    <h2>Settings</h2>

    <div className="settings-list">

      <div className="settings-item">
        <FaUser />
        <span>User Profile</span>
      </div>

      <div className="settings-item">
        <FaShieldAlt />
        <span>Privacy & Security</span>
      </div>

      <div className="settings-item">
        <FaPalette />
        <span>Theme Settings</span>
      </div>

      <div className="settings-item">
        <FaCog />
        <span>System Settings</span>
      </div>

      <div className="settings-item logout">
        <FaSignOutAlt />
        <span>Logout</span>
      </div>

    </div>
  </div>
);


// ================= HELP (TOUCHABLE INFO BOXES) =================
const HelpPage = () => (
  <div>
    <h2>Help Center</h2>

    <div className="help-container">

      <div className="help-card">
        <h3>📧 Email Support</h3>
        <p>management@details.gmail.com</p>
      </div>

      <div className="help-card">
        <h3>📞 Phone Support</h3>
        <p>044-345678</p>
      </div>

      <div className="help-card">
        <h3>⏰ Working Hours</h3>
        <p>9:00 AM - 6:00 PM</p>
      </div>

    </div>
  </div>
);
  

  return (
    <div className="app">

      <div className="sidebar">
        <h2>ERP Portal</h2>
        <ul>
          <li onClick={()=>setPage("dashboard")}><FaUsers/> Dashboard</li>
          <li onClick={()=>setPage("students")}><FaUserGraduate/> Students</li>
          <li onClick={()=>setPage("departments")}><FaBook/> Departments</li>
          <li onClick={()=>setPage("settings")}><FaCog/> Settings</li>
          <li onClick={()=>setPage("help")}><FaInfoCircle/> Help</li>
        </ul>
      </div>

      <div className="main-content">
        {page==="dashboard" && <Dashboard/>}
        {page==="students" && <StudentsPage/>}
        {page==="departments" && <DepartmentsPage/>}
        {page==="settings" && <SettingsPage/>}
        {page==="help" && <HelpPage/>}
      </div>

    </div>
  );
}

export default App;