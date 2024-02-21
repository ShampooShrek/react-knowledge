import {
  DocumentSolidIcon,
  FolderSolidIcon,
  Icons,
  UserSolidIcon,
} from "@/components/icons";

interface StatusProps {
  icon: "file" | "folder" | "user";
  title: string;
  value: number;
  color: string;
}

export default function Status({ icon, title, value, color }: StatusProps) {
  const Icon = ({ className }: { className: string }) => {
    if (icon === "folder")
      return <FolderSolidIcon className={className} color={color} />;
    else if (icon === "file")
      return <DocumentSolidIcon className={className} color={color} />;
    else if (icon === "user")
      return <UserSolidIcon className={className} color={color} />;
    else return <UserSolidIcon className={className} color={color} />;
  };

  return (
    <div className="flex justify-between items-center p-5 border-4 border-[#11111b] rounded-lg shadow-2xl">
      <div>
        <Icon className="w-20 h-20" />
      </div>
      <div className="flex flex-col justify-around items-end h-full text-end">
        <span className="text-base">{title}</span>
        <span className="text-4xl">{value}</span>
      </div>
    </div>
  );
}
