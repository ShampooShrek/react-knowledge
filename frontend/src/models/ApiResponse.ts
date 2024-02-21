interface ApiResponse<response> {
  type: "error" | "success",
  response: response
}

export interface ApiServiceResponse<DataType> {
  count: number
  limit: number
  data: DataType
}


export default ApiResponse
