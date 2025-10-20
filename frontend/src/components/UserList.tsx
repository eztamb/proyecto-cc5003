import React, { useState, useEffect } from "react";
import server from "../services/server";
import type { User } from "../types/types";

interface UserListProps {
  user: User | null;
}

const UserList: React.FC<UserListProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await server.getAllUsers();
        setUsers(userList);
      } catch {
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "admin" | "reviewer") => {
    try {
      await server.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      setError("Error al cambiar el rol del usuario");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await server.deleteUser(userId);
        setUsers(users.filter((u) => u.id !== userId));
      } catch {
        setError("Error al eliminar el usuario");
      }
    }
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h1>Administrar Usuarios</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value as "admin" | "reviewer")}
                  disabled={u.id === user?.id}
                >
                  <option value="reviewer">Reviewer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(u.id)} disabled={u.id === user?.id}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
