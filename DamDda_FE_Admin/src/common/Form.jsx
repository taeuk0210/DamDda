const Form = ({ children, title }) => {
  return (
    <div className="form-item">
      <span className="form-title">{title}</span>
      <div className="form-children">{children}</div>
    </div>
  );
};

export default Form;
