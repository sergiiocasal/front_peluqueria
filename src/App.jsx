import VisitForm from "./VisitForm";
import Header from "./Header";

const App = () => {

  return (
    <>
      <Header/>
      <div className="container" style={{ textAlign: "center", margin: "50px", fontFamily: "Arial, sans-serif" }}>
        <h2>Registro de Visitas</h2>
        <VisitForm />
      </div>
    </>
  );
};

export default App;
