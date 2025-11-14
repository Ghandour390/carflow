import react from "react";
import { useMemo } from "react";


export  default function UserSerche(data,serche) {  
    const [filter, setFilter] = react.useState(null);

      useMemo(() => {
        if (serche === "") {
          setFilter(data);
        } else {
          const result = data.filter((user) =>
            user.firstName.toLowerCase().includes(serche.toLowerCase()) ||
            user.lastName.toLowerCase().includes(serche.toLowerCase()) ||
            user.email.toLowerCase().includes(serche.toLowerCase())
          );
          setFilter(result);
        }

}, [data, serche]);

    return filter;
}

    