import { useSelector } from "react-redux";

export default function useAuth() {
  return useSelector((state) => state.auth.auth);
}
