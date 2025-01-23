import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [userData, setUserData] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveUser = async () => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (formData.name && formData.email && formData.phone && formData.company) {
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address");
        return;
      }
      if (formData.phone.length<10 || formData.phone.length>10) {
        alert("Please enter a valid 10 Digit Phone Number");
        return;
      }
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newUser = await response.json();

          setUserData([...userData, newUser]);
          toast.success("User added successfully!");

          setFormData({ name: "", email: "", phone: "", company: "" });
          const modal = document.getElementById("exampleModal");
          const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
          bootstrapModal.hide();
        } else {
          toast.error("Failed to add user!");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while adding the user.");
      }
    } else {
      alert("Please fill in all fields");
    }
  };



  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("User deleted successfully");
        toast.success("User deleted successfully!");
        setUserData(userData.filter((user) => user.id !== id));
      } else {
        console.error("Failed to delete user");
        toast.error("Failed to delete user!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while deleting the user.");
    }
  };


  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedData({ ...user });
  };


  const handleSave = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users/${editingUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );

      if (response.ok) {
        console.log("User updated successfully");
        toast.success("User updated successfully!");
        setUserData(
          userData.map((user) =>
            user.id === editingUser ? { ...editedData } : user
          )
        );
        setEditingUser(null);
      } else {
        console.error("Failed to update user");
        toast.error("Failed to update user!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while updating the user.");
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };


  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((data) => data.json())
      .then((data) => {
        setUserData(data);
      });
  }, []);

  return (
    <>
      <ToastContainer />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 20px", backgroundColor: "#f7f7f7", margin: "0" }}>
        <h1 style={{}}>User Lists</h1>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add User
        </button>
      </div>



      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          backgroundColor: "#f7f7f7"
        }}
      >
        {userData.map((data) => (
          <div
            key={data.id}
            style={{
              width: "31%",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              borderRadius: "10px",
              margin: "10px",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#fff"
            }}
          >
            {editingUser === data.id ? (
              <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "column" }}>
                <input
                  type="text"
                  name="name"
                  value={editedData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  style={{ marginBottom: "10px", padding: "0px", height: "30px" }}
                />
                <input
                  type="text"
                  name="email"
                  value={editedData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  style={{ marginBottom: "10px", padding: "0px", height: "30px" }}
                />
                <input
                  type="text"
                  name="phone"
                  value={editedData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  style={{ marginBottom: "10px", padding: "0px", height: "30px" }}
                />
                <div>
                  <button onClick={handleSave} style={{ marginRight: "7px", height: "30px", backgroundColor: "lightgreen", border: "none", borderRadius: "5px", fontWeight: "600" }}>Save</button>
                  <button onClick={() => setEditingUser(null)} style={{ height: "30px", border: "none", borderRadius: "5px", fontWeight: "600" }}>Cancel</button>
                </div>

              </div>
            ) : (
              <>
                <p>Id: {data.id}</p>
                <p>Name: {data.name}</p>
                <p>Email Id: {data.email}</p>
                <p>Number: {data.phone}</p>
                <p>Company: {data.company.name}</p>
                <p>Website: {data.website}</p>
                <div style={{ display: "flex" }}>
                  <button onClick={() => handleDelete(data.id)} style={{ marginRight: "7px", height: "30px", backgroundColor: "#FF4B5B ", border: "none", borderRadius: "5px", fontWeight: "600" }}>Delete</button>
                  <button onClick={() => handleEdit(data)} style={{ height: "30px", border: "none", borderRadius: "5px", fontWeight: "600" }}>Edit</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>




      {/* Modal Structure */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add New User
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  name="name"
                  value={formData.name}
                  onChange={handleAddInputChange}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="userEmail"
                  name="email"
                  value={formData.email}
                  onChange={handleAddInputChange}
                  placeholder="Enter email"
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}" 
                  title="Please enter a valid email address"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userPhone" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userPhone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleAddInputChange}
                  placeholder="Enter phone"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="userCompany" className="form-label">
                  Company
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userCompany"
                  name="company"
                  value={formData.company}
                  onChange={handleAddInputChange}
                  placeholder="Enter company"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveUser}
              >
                Save User
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;