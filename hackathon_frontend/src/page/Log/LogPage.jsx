import { useEffect, useState } from "react";
import axios from "axios";
import { logColumn } from "../../components/colomns/logColumn";
import DataTable from "../../components/Tables/DataTable";
import baseURL from "../../api/baseUrl";

const LogPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    baseURL
      .get("/log")
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
      });
  }, []);

  return (
    <div className="container mt-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Logs</h1>
      </div>
      <DataTable columns={logColumn} data={logs} />
    </div>
  );
};

export default LogPage;
