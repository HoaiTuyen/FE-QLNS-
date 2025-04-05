import React from "react";
import { Empty } from "antd";

const EmptyDataFallback = ({ description = "Không có dữ liệu" }) => {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <Empty description={description} />
    </div>
  );
};

export default EmptyDataFallback;
