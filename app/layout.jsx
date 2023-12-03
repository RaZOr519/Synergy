import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

import Nav from "./components/Nav";
import Provider from "../app/components/Provider";

export const metadata = {
  title: "Synergy",
  description: "",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
