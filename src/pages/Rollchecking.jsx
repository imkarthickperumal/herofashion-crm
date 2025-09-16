// import { useEffect } from "react";

// const Rollchecking = () => {
//   useEffect(() => {
//     window.open("https://g5s2jh39-7006.inc1.devtunnels.ms/", "_blank");
//   }, []);

//   return <div>Redirecting to Roll Checking…</div>;
// };

// export default Rollchecking;

const Rollchecking = () => {
  return (
    <div>
      <iframe
        src="https://g5s2jh39-7006.inc1.devtunnels.ms/"
        style={{ width: "100%", height: "100vh", border: "none" }}
        title="Roll Checking PWA"
      />
    </div>
  );
};

export default Rollchecking;
