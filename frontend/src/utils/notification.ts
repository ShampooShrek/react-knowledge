import { toast } from "react-toastify";

const notification = (
  notification: string | undefined,
  type: "error" | "success",
) => {
  toast(notification ?? "Ops, algo deu errado, tente novamente mais tarde!", {
    theme: "dark",
    type,
  });
};

export default notification;
