import { useDispatch } from "react-redux";
import { authorize, logout } from "../../slices/Auth";
import { useMemo } from "react";
import { bindActionCreators } from "redux";

export default function useAuthActions() {
  const dispatch = useDispatch();
  return useMemo(
    () => bindActionCreators({ authorize, logout }, dispatch), //authorize, logout자리에 action이름 선언
    [dispatch]
  );
}
