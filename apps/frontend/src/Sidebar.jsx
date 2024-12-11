export default function Sidebar({ children, toggled }) {
  return (
    <>
      <div className={"sidebar" + (toggled ? " active" : "")}>{children}</div>
    </>
  );
}
