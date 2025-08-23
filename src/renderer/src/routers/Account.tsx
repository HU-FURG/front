/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { fetchUsers, removeUser, createUser } from "@renderer/services/UserRequests"

type UserRole = "admin" | "user"
type User = { login:string, hierarquia:string, lastLogin_at: Date }
type client = {login:string | null, hierarquia:string | null}

export default function Accounts(): React.JSX.Element {
  const [currentUser] = useState<client>({ login: localStorage.getItem('user'), hierarquia: localStorage.getItem('cargo')})
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showNewUserModal, setShowNewUserModal] = useState(false)
  const [newLogin, setNewLogin] = useState("")
  const [newSenha, setNewSenha] = useState("")
  const [newRole, setNewRole] = useState<UserRole>("user")
  const [loading, setLoading] = useState(true)

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers()
      setUsers(data)
    } catch (err) {
      console.error("Erro ao carregar usuários:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleCreateUser = async () => {
    try {
      await createUser(newLogin, newSenha, newRole)
      setShowNewUserModal(false)
      setNewLogin("")
      setNewSenha("")
      setNewRole("user")
      await loadUsers()
    } catch (err) {
      console.error("Erro ao criar usuário:", err)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleRemoveUser = async (login: string) => {
    if (!confirm(`Deseja realmente remover o usuário ${login}?`)) return
    try {
      await removeUser(login)
      setSelectedUser(null)
      await loadUsers()
    } catch (err) {
      console.error("Erro ao remover usuário:", err)
    }
  }

  return (
    <main className="flex-1 h-full p-5 bg-gray-100 space-y-6">
      {/* Minha Conta */}
      <div className="bg-white rounded-lg shadow p-5 space-y-2">
        <h2 className="text-lg font-bold text-gray-800">Minha Conta</h2>
        <p>
          <strong>Login:</strong> {currentUser.login}
        </p>
        <p>
          <strong>Tipo:</strong>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentUser.hierarquia === "admin"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {currentUser.hierarquia}
          </span>
        </p>
      </div>

      {/* Gerenciar Contas */}
      <div className="bg-white rounded-lg shadow p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Gerenciar Contas</h2>
          <button
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowNewUserModal(true)}
          >
            <Plus className="mr-1 w-4 h-4" /> Nova Conta
          </button>
        </div>

        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.login} className="hover:bg-gray-100 cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.login}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.hierarquia === "admin" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.hierarquia}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detalhes Usuário */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">Gerenciar {selectedUser.login}</h2>
            <p>
              <strong>Login:</strong> {selectedUser.login}
            </p>
            <p>
              <strong>Tipo:</strong> {selectedUser.hierarquia}
            </p>

            <div className="flex gap-2 mt-4">
              <button className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleRemoveUser(selectedUser.login)}>
                Excluir
              </button>
              <button className="px-3 py-2 rounded border" onClick={() => setSelectedUser(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Conta */}
      {showNewUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-bold mb-4">Criar Nova Conta</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Login"
                value={newLogin}
                onChange={(e) => setNewLogin(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <input
                type="password"
                placeholder="Senha"
                value={newSenha}
                onChange={(e) => setNewSenha(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
              <select value={newRole} onChange={(e) => setNewRole(e.target.value as UserRole)} className="w-full px-3 py-2 border rounded">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end mt-4 gap-2">
              <button className="px-3 py-2 rounded border hover:bg-gray-100" onClick={() => setShowNewUserModal(false)}>
                Fechar
              </button>
              <button className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleCreateUser}>
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
