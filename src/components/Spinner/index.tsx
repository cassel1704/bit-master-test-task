import React from "react";
import { Spin } from "antd";

interface ISpinner {
  className?: string;
  tip: string;
}

const Spinner: React.FC<ISpinner> = ({ className, tip }) => {
  return (
    <div className="spinner-wrapper">
      <Spin wrapperClassName={className} tip={tip} />
    </div>
  );
};

export default Spinner;
