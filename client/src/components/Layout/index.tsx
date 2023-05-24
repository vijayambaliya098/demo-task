import Sidebar from "../Sidebar";
import "./style.css";

const Layout = ({ children }: any) => {
  return (
    <div className="layout">
      <header>React Test</header>
      <article>{children}</article>
      <aside>
        <Sidebar />
      </aside>
    </div>
  );
};

export default Layout;
