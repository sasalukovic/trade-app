/* eslint-disable react/prop-types */
const Login = ({ onLogin }) => {
  const handleLogin = () => {
    const isAuthenticated = true;
    if (isAuthenticated) {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;
