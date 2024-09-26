"use client";

import React from "react";
import GridLoader from "react-spinners/GridLoader";

const Spinner: React.FC<{ loading: boolean }> = ({ loading }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-24 h-3/4">
      <GridLoader color="#ce193c" loading={loading} size={25} />
    </div>
  );
};

export default Spinner;
