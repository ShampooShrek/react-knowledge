import StatusType from "@/models/status";
import Status from "./Status/Status";
import "bootstrap-icons/font/bootstrap-icons.css";

interface HomeComponentProps {
  status: StatusType;
}

export default function HomeComponent({ status }: HomeComponentProps) {
  return (
    <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Status
        color="#f38ba8"
        value={status.categories}
        title="Categorias"
        icon="folder"
      />
      <Status
        color="#a6e3a1"
        value={status.articles}
        title="Artigos"
        icon="file"
      />
      <Status
        color="#89b4fa"
        value={status.users}
        title="Usuários"
        icon="user"
      />
    </div>
  );
}
