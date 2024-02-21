import styled from "styled-components";

interface AdminTableProps {
  tableTds: string[];
  children: React.ReactNode;
}

const Tbody = styled.tbody`
  width: 100%;
  td {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px;
    font-size: 0.875rem;
  }
`;

export default function AdminTable({ tableTds, children }: AdminTableProps) {
  return (
    <table className="w-full bg-mantle mt-4">
      <thead className="bg-crust">
        <tr>
          {tableTds.map((t, i) => (
            <td key={`${t}-${i}`} className="p-[2px] text-sm">
              {t}
            </td>
          ))}
        </tr>
      </thead>
      <Tbody>{children}</Tbody>
    </table>
  );
}
