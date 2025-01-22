import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserList = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullname: "",
    role: "user", // Default role
  });
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) return handleLogout();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        Swal.fire("Error", "Failed to fetch users. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching users.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddUser = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return handleLogout();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        Swal.fire("Success", "User has been added successfully", "success");
        fetchUsers();
        setNewUser({
          username: "",
          password: "",
          fullname: "",
          role: "user", // Reset default role
        });
        setShowAddUserForm(false);
      } else {
        Swal.fire("Error", "Failed to add user. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return handleLogout();

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        Swal.fire("Success", "User has been updated successfully", "success");
        fetchUsers();
        setSelectedUser(null);
      } else {
        Swal.fire("Error", "Failed to update user. Please try again later.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) return handleLogout();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            Swal.fire("Deleted!", "User has been deleted successfully", "success");
            fetchUsers();
          } else {
            Swal.fire("Error", "Failed to delete user. Please try again later.", "error");
          }
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={() => setShowAddUserForm(!showAddUserForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showAddUserForm ? "Cancel" : "Add New User"}
          </button>
        </header>

        {/* Remaining UI Elements... */}
      </div>
    </div>
  );
};

export default UserList;
