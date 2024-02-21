"use client";

import { Pagination } from "@mui/material";

import { useAppDispatch } from "@/lib/store";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import api from "@/services/api";
import ApiResponse from "@/models/ApiResponse";
import { AxiosError } from "axios";
import notification from "@/utils/notification";
import { useQuery } from "react-query";
import getItensByPagination from "@/services/getItensByPagination";

interface PaginationWithRequestProps<PayloadType> {
  count: number;
  limit: number;
  updateUrl: string;
  updateFunction: ActionCreatorWithPayload<PayloadType, string>; //string - "selectorName/functionName"
}

export default function PaginationWithRequest<PayloadType>({
  updateUrl,
  count,
  limit,
  updateFunction,
}: PaginationWithRequestProps<PayloadType>) {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  const { data, isError, isLoading } = useQuery<
    ApiResponse<PayloadType>,
    AxiosError<ApiResponse<string>>
  >({
    queryKey: ["itens-page", page],
    queryFn: () => getItensByPagination(updateUrl, page),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data && data.response) {
      dispatch(updateFunction(data.response));
    }
  }, [data]);

  const handleOnChange = (ev: any, value: number) => {
    if (value !== page) setPage(value);
  };

  return (
    <div className="w-full mx-auto mt-2 flex justify-center">
      <Pagination
        count={Math.ceil(count / limit)}
        onChange={handleOnChange}
        defaultPage={page}
        color="primary"
      />
    </div>
  );
}
