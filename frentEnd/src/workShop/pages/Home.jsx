import React from "react";
import { useFetch } from "../Hook/useFetch";
import UserSerche from "../Hook/useUserSerche";


export  default function Home() {
    const [serche, setSerche] = React.useState("");
    
    
    const { loading, data, error } = useFetch("https://dummyjson.com/users");
    // console.log(data);
    const filter = UserSerche(data,serche);
    console.log(filter);
    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>{error.message}</h1>;
    if (!data) return <h1>No data</h1>;
    return (
        <div>
            <h1>Home</h1>
            <div className="serche-box " >
                <input
                   label="Search"
                    placeholder="Search"
                    type="text"
                    value={serche}
                    onChange={(e) => setSerche(e.target.value)}
                />
            </div>
            <h1>Users</h1>
            <ul className="user-list ">
                {filter.map((user) => (
                    <h1 className="user-item text-center font-bold text-2xl" key={user.id}>
                        <h1>{user.firstName} </h1>
                        <h1>{user.lastName} </h1>
                        <h1>{user.email} </h1>
                        </h1>
                  
                ))}
            </ul>
        </div>
    );
}