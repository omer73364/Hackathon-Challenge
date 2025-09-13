import formatDate from "../../hook/UtilsFunctions/FormatDate";

export const logColumn = [
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
      const date = row.original.name;
      return <div>{date}</div>;
    },
  },
  {
  accessorKey: "matched",
  header: "Matched",
  cell: ({ row }) => {
    const matched = row.original.matched;
    return <div>{matched ? "Yes" : "No"}</div>; 
  },
},

  {
    accessorKey: "score",
    header: "Score",

    cell: ({ row }) => {
      const date = row.original.score;
      return <div>{date}%</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <div>{formatDate(date)}</div>;
    },
  },
];
