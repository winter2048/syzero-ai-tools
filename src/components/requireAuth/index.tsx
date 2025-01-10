import React, { useRef, useEffect, useImperativeHandle } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppStore";

function RequireAuth({ children }: { children: JSX.Element }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!token) {
      navigate(`/login?redirect=${location.pathname}`);
    }
  }, [location.pathname, navigate, token]);

  return children;
}

export default RequireAuth;
