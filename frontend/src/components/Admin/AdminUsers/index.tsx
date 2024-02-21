"use client";

import ApiResponse from "@/models/ApiResponse";
import api from "@/services/api";
import { AxiosError } from "axios";
import { useState } from "react";
import AdminTable from "../AdminTable";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import Pagination from "../AdminPagination";
import User, { UserFormType } from "@/models/user";
import { addUser, removeUser, updateUser } from "@/lib/features/user/userSlice";
import UserForm from "./UserForm";
import notification from "@/utils/notification";

interface AdminUsersProps {
  setModificated(modificated: boolean): void;
}

const defaultUser: UserFormType = {
  name: "",
  email: "",
  password: "",
  confPassword: "",
};

export default function AdminUsers({ setModificated }: AdminUsersProps) {
  const [user, setUser] = useState<UserFormType>(defaultUser);
  const [usersPagination, setUsersPagination] = useState<User[]>([]);

  const dispatch = useAppDispatch();
  const {
    users: { users },
  } = useAppSelector((state) => state);

  const setDefault = () => {
    setUser(defaultUser);
    setModificated(false);
  };

  const handleUserInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaginationData = (data: User[]) => {
    setUsersPagination(data);
  };

  const saveUser = async () => {
    if (user.id) {
      try {
        const response = await api.put(`/users/${user.id}`, user);
        const data: ApiResponse<User> = response.data;
        dispatch(updateUser(data.response));
        setDefault();
        notification("Usuário atualizado com sucesso!", "success");
      } catch (err: any) {
        const e = err as AxiosError<ApiResponse<string>>;
        notification(e.response?.data.response, "error");
      }
    } else {
      try {
        const response = await api.post(`/admin`, user);
        const data: ApiResponse<User> = response.data;
        dispatch(addUser(data.response));
        setDefault();
        notification("Usuário criado com successo!", "success");
      } catch (err: any) {
        const e = err as AxiosError<ApiResponse<string>>;
        notification(e.response?.data.response, "error");
      }
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      const data: ApiResponse<string> = response.data;
      dispatch(removeUser(userId));
      notification("Usuário deletado com sucesso!", "success");
    } catch (e: any) {
      const error = e as AxiosError<ApiResponse<string>>;
      notification(error.response!.data.response, "error");
    }
  };

  const setEdit = (user: User) => {
    setUser({ ...user, confPassword: "" });
  };

  return (
    <div>
      <UserForm
        handleUserInput={handleUserInput}
        cancelForm={setDefault}
        user={user}
        saveUser={saveUser}
      />
      <AdminTable tableTds={["Código", "Nome", "E-mail", "Ações"]}>
        {usersPagination &&
          usersPagination.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td className="flex flex-col items-start justify-start">
                <button onClick={() => setEdit(e)}>Editar</button>
                <button onClick={() => deleteUser(e.id)}>Deletar</button>
              </td>
            </tr>
          ))}
      </AdminTable>
      {users && (
        <Pagination
          data={users}
          paginationData={handlePaginationData}
          limit={2}
        />
      )}
    </div>
  );
}
