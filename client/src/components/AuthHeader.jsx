import SkilloraLogo from "./SkilloraLogo";
import ThemeToggle from "./ThemeToggle";
import "./AuthHeader.css";

const AuthHeader = () => {
  return (
    <header className="auth-header">
      <div className="auth-header-inner">
        <SkilloraLogo variant="compact" showTagline={false} />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AuthHeader;