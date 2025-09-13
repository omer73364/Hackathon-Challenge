import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../../components/Tables/DataTable";
import baseURL from "../../api/baseUrl";
import { userColumn } from "../../components/colomns/userColums";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import formatDate from "../../hook/UtilsFunctions/FormatDate";
import { Fingerprint } from "lucide-react";

const UsersPage = () => {
  const [persons, setLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fingerprints, setFingerprints] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    baseURL
      .get("/persons")
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching logs:", err);
      });
  }, []);

  const fetchFingerprints = async (personId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://10.21.55.109:8080/persons/${personId}`);
      setFingerprints(response.data);
    } catch (error) {
      console.error("Error fetching fingerprints:", error);
      setFingerprints([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    fetchFingerprints(user.id);
  };

  const handleDialogChange = (open) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedUser(null);
      setFingerprints([]);
    }
  };

  const columnsWithFingerprints = [
    ...userColumn,
    {
      id: "fingerprints",
      header: "البصمات",
      cell: ({ row }) => (
<button
  onClick={() => openModal(row.original)}
  className="bg-customZahraa hover:bg-customZahraaH text-white p-2 rounded transition-colors flex items-center justify-center"
>
  <Fingerprint className="w-5 h-5" />
</button>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="container mt-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>
      </div>
      <DataTable columns={columnsWithFingerprints} data={persons} />
      
      {/* Shadcn Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              بصمات المستخدم: {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : fingerprints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fingerprints.map((fingerprint) => (
                  <div key={fingerprint.id} className="">
                    <div className="mb-2">
                      <img
                        src={fingerprint.fingerprint_img.trim()}
                        alt={`بصمة ${fingerprint.id}`}
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOWNhM2FmIiBmb250LXNpemU9IjE0Ij7Ys9mI2LHYqSDYutmK2LEg2YXYqtmI2YHYsdipPC90ZXh0Pgo8L3N2Zz4=';
                        }}
                      />
                    </div>
              
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>لا توجد بصمات متاحة لهذا المستخدم</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
