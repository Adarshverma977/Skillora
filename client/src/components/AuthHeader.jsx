
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import "./AuthHeader.css";

const AuthHeader = () => {
  return (
    <header className="auth-header">
      <div className="auth-header-inner">
        <Logo />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AuthHeader;
