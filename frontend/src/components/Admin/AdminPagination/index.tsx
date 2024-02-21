"use client"

import { Pagination as MuiPagination } from "@mui/material"
import { useEffect, useState } from "react"

interface PaginationProps<Data> {
  limit: number
  data: Data[]
  paginationData(data: Data[]): void
}

export default function Pagination<Data>({ data, paginationData, limit }: PaginationProps<Data>) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    paginationData(data.slice((page * limit) - limit, page * limit))
  }, [page, data])

  const handleOnChange = (ev: any, value: number) => {
    if (value !== page) setPage(value)
  }

  return (
    <div className="w-full mx-auto mt-2 flex justify-center">
      <MuiPagination count={Math.ceil(data.length / limit)} onChange={handleOnChange} defaultPage={page} color="primary" />
    </div>
  )
}
