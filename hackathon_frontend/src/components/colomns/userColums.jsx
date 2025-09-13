import formatDate from "../../hook/UtilsFunctions/FormatDate";

export const userColumn = [
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <div className="font-medium mx-2">{row.index + 1}</div>,
    enableSorting: false,
  },

  {
    accessorKey: "name",
    header: "Name",

    cell: ({ row }) => {
      const date = row.original?.name;
      return <div>{date}</div>;
    },
  },
 

  {
    accessorKey: "birthday",
    header: "birthday",

    cell: ({ row }) => {
      const date = row.original?.birthday;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: "phone",
    cell: ({ row }) => {
      const date = row.original?.phone;
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "address",
    header: "address",
    cell: ({ row }) => {
      const date = row.original?.address;
      return <div>{date}</div>;
    },
  },
  {
    accessorKey: "gender",
    header: "gender",
    cell: ({ row }) => {
      const date = row.original?.gender;
      return <div>{date}</div>;
    },
  },
];
