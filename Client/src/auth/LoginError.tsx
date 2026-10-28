import { useEffect, useRef } from "react";
import { useGlobalContext } from "../Context/useGlobalContext";

export default function LoginError() {
  const { loginErr, setLoginErr } = useGlobalContext();
  const timeoutRef = useRef<number | null>(null);

  const timeOut = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setLoginErr({ text: "", error: false });
    }, 3000);
  };

  if (loginErr.error) {
    timeOut();
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="loginErrorContainer"
      id={loginErr.error ? "loginErrTrue" : undefined}
    >
      <div className="errorText">{loginErr.text}</div>
    </div>
  );
}
