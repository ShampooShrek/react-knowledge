interface InputProps {
  type: "text" | "email" | "password" | "number"
  className: string
  value: string
  placeholder: string
  name: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}


export default function Input({ type, className, onChange, value, placeholder, name }: InputProps) {
  return (
    <input
      type={type}
      name={name}
      className={`p-1 text-white bg-mantle border-2 border-mantle t rounded outline-0 text-sm  focus:border-2 focus:border-crust  ${className}`}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
    />
  )
}
